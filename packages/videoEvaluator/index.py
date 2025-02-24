import cv2
import time
import mediapipe as mp
import numpy as np
from collections import defaultdict
from tensorflow.keras.models import load_model


def calculate_ear(eye_landmarks):
    # Eye aspect ratio (EAR) calculation
    p2_p6 = np.linalg.norm(np.array([eye_landmarks[1].x, eye_landmarks[1].y]) -
                            np.array([eye_landmarks[5].x, eye_landmarks[5].y]))
    p3_p5 = np.linalg.norm(np.array([eye_landmarks[2].x, eye_landmarks[2].y]) -
                            np.array([eye_landmarks[4].x, eye_landmarks[4].y]))
    p1_p4 = np.linalg.norm(np.array([eye_landmarks[0].x, eye_landmarks[0].y]) -
                            np.array([eye_landmarks[3].x, eye_landmarks[3].y]))
    
    ear = (p2_p6 + p3_p5) / (2.0 * p1_p4)
    return ear

# Function to detect if a person is looking up/down
'''
def detect_looking_direction(landmarks):
    nose = landmarks[1]      # Nose tip
    chin = landmarks[199]    # Chin
    forehead = landmarks[10] # Between eyebrows

    # Calculate vertical distances
    vertical_nose_chin = chin.y - nose.y
    vertical_forehead_nose = nose.y - forehead.y

    looking_direction = "Looking Forward"  # Default

    # Check up/down movement
    if vertical_nose_chin > 0.17:  # Chin moved down (Looking Up)
        looking_direction = "Looking Up"
    elif vertical_nose_chin > 0.12:  # Chin moved down (Looking Up)
        looking_direction = "Looking Forward"
    elif vertical_forehead_nose > 0.05:  # Forehead moved up (Looking Down)
        looking_direction = "Looking Down"

    return looking_direction



direction = detect_looking_direction(face_landmarks.landmark)

# Display detection result
cv2.putText(frame, direction, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

'''

# Function to detect if person looks away
def detect_head_turn(landmarks, frame_width):
    # Extract key face landmarks
    nose = landmarks[1]  # Nose tip
    left_eye = landmarks[33]  # Left eye corner
    right_eye = landmarks[263]  # Right eye corner

    # Calculate the center of the face
    face_center_x = (left_eye.x + right_eye.x) / 2
    deviation = (nose.x - face_center_x) * frame_width  # Convert to pixels

    # If deviation is large, person is looking away
    if abs(deviation) > 13.5:  # Adjust threshold as needed
        return True
    
    return False


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
    



    start_time = time.time()
    duration = 30  # 30 seconds

    total_frames=0
    lookaway_frames=0
    lookaway_frames_percent=0
    prev_lookingaway,curr_lookingaway=False,False
    prev_ld=0
    min_lookaway_duration=0.8
    lookaway_start,lookaway_end=0,0
    times_looked_away=0

    emotions_results = {
        'Angry':0,
        'Disgust':0,
        'Fear':0,
        'Happy':0,
        'Neutral':0,
        'Sad':0,
        'Surprise':0
    }
    emotions_percentages={}

    blink_count = 0
    blink_threshold = 0.34  # EAR threshold for blink detection
    prev_blink = False

    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True,max_num_faces = 1)
    

    mp_drawing = mp.solutions.drawing_utils
    drawing_spec = mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=1)  # Green mesh



    # Load the pre-trained emotion detection model and the Haar cascade classifier for face detection
    model = load_model('model_file_30epochs.h5')
    faceDetect = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

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


    while time.time() - start_time < duration:
        ret, frame = cap.read()
        if not ret:
            break
        
        frame = cv2.flip(frame, 1)  # Flip video output

       
        
        h, w, _ = frame.shape

        # Calculate and display FPS
        curr_time = time.time()
        fps = 1.0 / (curr_time - prev_time) if (curr_time - prev_time) > 0 else 0
        prev_time = curr_time
        # Calculate the text size to determine the width of the text

        text = f"FPS: {fps:.2f}"
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.7
        thickness = 2

        # Get text size (width, height)
        text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]

        # Get the width of the frame (image)
        frame_width = frame.shape[1]

        # Calculate the position to place the text on the right side
        x_position = frame_width - text_size[0] - 10  # 10 pixels padding from the right

        cv2.putText(frame, f"FPS: {fps:.2f}", (x_position, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Convert frame to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = faceDetect.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=3)
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_mesh_results = face_mesh.process(rgb_frame)
        
        if face_mesh_results.multi_face_landmarks:
            for face_landmarks in face_mesh_results.multi_face_landmarks:

                if detect_head_turn(face_landmarks.landmark, w):
                    curr_lookingaway=True
                    if not prev_lookingaway and curr_lookingaway:
                        lookaway_start=time.time()
                    cv2.putText(frame, "LOOKING AWAY!", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    prev_lookingaway=True
                    lookaway_frames+=1
                else:
                    curr_lookingaway=False
                    if prev_lookingaway and not curr_lookingaway:
                        lookaway_end=time.time()
                    prev_lookingaway=False

                if lookaway_end-lookaway_start>min_lookaway_duration and prev_ld !=lookaway_end-lookaway_start:
                    prev_ld=lookaway_end-lookaway_start
                    print(lookaway_end-lookaway_start)
                    times_looked_away+=1
                

                total_frames+=1
                
                # Draw the green face mesh
                mp_drawing.draw_landmarks(frame, face_landmarks, mp_face_mesh.FACEMESH_TESSELATION, drawing_spec, drawing_spec)

                left_eye_landmarks = [face_landmarks.landmark[i] for i in [362, 385, 387, 263, 373, 380]]
                right_eye_landmarks = [face_landmarks.landmark[i] for i in [33, 160, 158, 133, 153, 144]]
                
                left_ear = calculate_ear(left_eye_landmarks)
                right_ear = calculate_ear(right_eye_landmarks)
                avg_ear = (left_ear + right_ear) / 2.0
                
                if avg_ear < blink_threshold and not prev_blink:
                    blink_count += 1  # Blink detected
                    prev_blink = True
                elif avg_ear >= blink_threshold:
                    prev_blink = False
        
        for (x, y, w, h) in faces:
            sub_face_img = gray[y:y + h, x:x + w]
            resized = cv2.resize(sub_face_img, (48, 48))
            normalized = resized / 255.0
            reshaped = np.reshape(normalized, (1, 48, 48, 1))

            result = model.predict(reshaped)
            label_index = np.argmax(result, axis=1)[0]
            label_text = labels_dict.get(label_index, "Unknown")
            print("Detected emotion:", label_text)

            #add result to emotions results
            emotions_results[label_text]+=1

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.rectangle(frame, (x, y - 40), (x + w, y), (50, 50, 255), cv2.FILLED)
            cv2.putText(frame, label_text, (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        
        # Show video output on screen
        cv2.putText(frame, f"Blinks: {blink_count}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        cv2.imshow('Live Face Analysis', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

    lookaway_frames_percent=round(((lookaway_frames/total_frames)*100),2)
    if lookaway_frames_percent>0 and times_looked_away==0:
        times_looked_away=1
    
    #printing all metrics
    print(f"\nLookaway Percentage: {lookaway_frames_percent}%")
    print(f"Looked away {times_looked_away} times")
    print(f"Blinked {blink_count} times")

    total_emo=sum(emotions_results.values())
    for emo in emotions_results.keys():
        if not emotions_results[emo]==0:
            emotions_percentages[emo]=round(((emotions_results[emo]/total_emo)*100),2)
    print("Emotions percentage: ",emotions_percentages)


if __name__ == "__main__":
    analyze_face()
