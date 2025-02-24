import cv2
import time
import mediapipe as mp
import numpy as np
from tensorflow.keras.models import load_model

# Flag to control drawing of the full face mesh (set to False for performance)
DRAW_FACE_MESH = False

def detect_head_turn(landmarks, frame_width):
    # Extract key face landmarks
    nose = landmarks[1]      # Nose tip
    left_eye = landmarks[33]   # Left eye corner
    right_eye = landmarks[263]  # Right eye corner

    # Calculate the center of the face
    face_center_x = (left_eye.x + right_eye.x) / 2
    deviation = (nose.x - face_center_x) * frame_width  # Convert to pixels
    return abs(deviation) > 13.5

def compute_face_bbox(face_landmarks, frame_width, frame_height, pad=10):
    # Compute bounding box from mediapipe landmarks
    xs = [lm.x for lm in face_landmarks.landmark]
    ys = [lm.y for lm in face_landmarks.landmark]
    x_min = int(min(xs) * frame_width)
    y_min = int(min(ys) * frame_height)
    x_max = int(max(xs) * frame_width)
    y_max = int(max(ys) * frame_height)
    
    # Add padding and constrain to frame dimensions
    x_min = max(0, x_min - pad)
    y_min = max(0, y_min - pad)
    x_max = min(frame_width, x_max + pad)
    y_max = min(frame_height, y_max + pad)
    
    return x_min, y_min, x_max, y_max

def analyze_face():
    # Attempt to open the external webcam (index 2) using the V4L2 backend
    external_cam_index = 2
    cap = cv2.VideoCapture(external_cam_index, cv2.CAP_V4L2)

    if not cap.isOpened():
        print(f"Failed to open camera index {external_cam_index}. Falling back to webcam index 0.")
        cap = cv2.VideoCapture(1)
        if not cap.isOpened():
            print("Failed to open fallback webcam index 0. Exiting.")
            exit(1)
        else:
            print("Fallback webcam index 0 opened successfully.")
    else:
        print(f"Camera index {external_cam_index} opened successfully.")

    # Lower resolution for faster processing
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    total_frames = 0
    lookaway_frames = 0
    prev_lookingaway = False
    min_lookaway_duration = 0.8
    lookaway_start, lookaway_end = 0, 0
    times_looked_away = 0

    # Emotion categories for interview evaluation:
    # - Confident: Happy
    # - Neutral: Angry, Disgust, Neutral, Sad
    # - Nervous: Fear, Surprise
    emotion_categories = {
        'Confident': 0,
        'Neutral': 0,
        'Nervous': 0
    }

    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, max_num_faces=3)

    # Use drawing utilities only if needed (disabled by default)
    mp_drawing = mp.solutions.drawing_utils
    drawing_spec = mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=1)

    # Load the pre-trained emotion detection model
    model = load_model('model_file_30epochs.h5')

    # Mapping from model prediction index to emotion label
    labels_dict = {
        0: 'Angry',
        1: 'Disgust',
        2: 'Fear',
        3: 'Happy',
        4: 'Neutral',
        5: 'Sad',
        6: 'Surprise'
    }

    prev_time = time.time()
    emotion_skip_frames = 3  # Run heavy model prediction every few frames

    # Create a resizable window for display
    cv2.namedWindow('Live Face Analysis', cv2.WINDOW_NORMAL)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame. Exiting...")
            break

        # Mirror the frame for natural interaction
        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        curr_time = time.time()
        fps = 1.0 / (curr_time - prev_time) if (curr_time - prev_time) > 0 else 0
        prev_time = curr_time

        # Display FPS on the top-right corner and exit instruction at the bottom
        fps_text = f"FPS: {fps:.2f}"
        text_size = cv2.getTextSize(fps_text, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)[0]
        cv2.putText(frame, fps_text, (w - text_size[0] - 10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.putText(frame, "Press 'q' to exit", (10, h - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_mesh_results = face_mesh.process(rgb_frame)

        face_bbox = None
        if face_mesh_results.multi_face_landmarks:
            bboxes = []
            for face_landmarks in face_mesh_results.multi_face_landmarks:
                bbox = compute_face_bbox(face_landmarks, w, h, pad=10)
                bboxes.append(bbox)
                if DRAW_FACE_MESH:
                    mp_drawing.draw_landmarks(frame, face_landmarks,
                                              mp_face_mesh.FACEMESH_TESSELATION,
                                              drawing_spec, drawing_spec)
                # Check head turn (LOOKING AWAY!)
                if detect_head_turn(face_landmarks.landmark, w):
                    if not prev_lookingaway:
                        lookaway_start = time.time()
                    # (Optional: You can still display head-turn status if desired)
                    cv2.putText(frame, "LOOKING AWAY!", (50, 50),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                    prev_lookingaway = True
                    lookaway_frames += 1
                else:
                    if prev_lookingaway:
                        lookaway_end = time.time()
                        if (lookaway_end - lookaway_start) > min_lookaway_duration:
                            times_looked_away += 1
                    prev_lookingaway = False
                total_frames += 1

            # Choose the largest bounding box (by area)
            face_bbox = max(bboxes, key=lambda box: (box[2]-box[0])*(box[3]-box[1]))

        # Run emotion detection only if a valid face bounding box exists and on selected frames
        if face_bbox is not None and total_frames % emotion_skip_frames == 0:
            x_min, y_min, x_max, y_max = face_bbox
            if (x_max - x_min) * (y_max - y_min) > 1000:  
                sub_face_img = gray[y_min:y_max, x_min:x_max]
                try:
                    resized = cv2.resize(sub_face_img, (48, 48))
                except Exception:
                    continue
                normalized = resized / 255.0
                reshaped = np.reshape(normalized, (1, 48, 48, 1))
                result = model.predict(reshaped)
                label_index = np.argmax(result, axis=1)[0]
                label_text = labels_dict.get(label_index, "Unknown")

                # Update emotion counters
                if label_text == "Happy":
                    emotion_categories['Confident'] += 1
                elif label_text in ['Angry', 'Disgust', 'Neutral', 'Sad']:
                    emotion_categories['Neutral'] += 1
                elif label_text in ['Fear', 'Surprise']:
                    emotion_categories['Nervous'] += 1
                # NOTE: No drawing of bounding box or text for emotion is performed.

        total_frames += 1
        cv2.imshow('Live Face Analysis', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

    total_emotions = sum(emotion_categories.values())
    if total_emotions > 0:
        confident_pct = round((emotion_categories['Confident'] / total_emotions) * 100, 2)
        neutral_pct = round((emotion_categories['Neutral'] / total_emotions) * 100, 2)
        nervous_pct = round((emotion_categories['Nervous'] / total_emotions) * 100, 2)
    else:
        confident_pct = neutral_pct = nervous_pct = 0
        print("Warning: No emotions were detected.")

    lookaway_pct = round((lookaway_frames / total_frames) * 100, 2) if total_frames > 0 else 0

    print(f"\nLookaway Percentage: {lookaway_pct}%")
    print(f"Looked away {times_looked_away} times")
    print("Emotion percentages:")
    print(f"  Confident: {confident_pct}%")
    print(f"  Neutral:   {neutral_pct}%")
    print(f"  Nervous:   {nervous_pct}%")

if __name__ == "__main__":
    analyze_face()
