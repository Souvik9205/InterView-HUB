import cv2
import numpy as np
import time
from tensorflow.keras.models import load_model

# Attempt to open the external webcam (index 2) using the V4L2 backend
external_cam_index = 2
video = cv2.VideoCapture(external_cam_index, cv2.CAP_V4L2)

if not video.isOpened():
    print(f"Failed to open camera index {external_cam_index}. Falling back to webcam index 0.")
    video = cv2.VideoCapture(0)
    if not video.isOpened():
        print("Failed to open fallback webcam index 0. Exiting.")
        exit(1)
    else:
        print("Fallback webcam index 0 opened successfully.")
else:
    print(f"Camera index {external_cam_index} opened successfully.")

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

while True:
    ret, frame = video.read()
    if not ret:
        print("Failed to capture frame from camera. Exiting.")
        break

    # Flip the frame horizontally (mirror view)
    frame = cv2.flip(frame, 1)

    # Calculate and display FPS
    curr_time = time.time()
    fps = 1.0 / (curr_time - prev_time) if (curr_time - prev_time) > 0 else 0
    prev_time = curr_time
    cv2.putText(frame, f"FPS: {fps:.2f}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    # Convert frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = faceDetect.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=3)

    for (x, y, w, h) in faces:
        sub_face_img = gray[y:y + h, x:x + w]
        resized = cv2.resize(sub_face_img, (48, 48))
        normalized = resized / 255.0
        reshaped = np.reshape(normalized, (1, 48, 48, 1))

        result = model.predict(reshaped)
        label_index = np.argmax(result, axis=1)[0]
        label_text = labels_dict.get(label_index, "Unknown")
        print("Detected emotion:", label_text)

        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
        cv2.rectangle(frame, (x, y - 40), (x + w, y), (50, 50, 255), cv2.FILLED)
        cv2.putText(frame, label_text, (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    cv2.imshow("Frame", frame)
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break

video.release()
cv2.destroyAllWindows()