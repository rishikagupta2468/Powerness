import numpy as np
from cv2 import cv2
import os
import sys

# print("python started")
########## KNN CODE ############
def dist(x1,y1):
	return np.sqrt(np.sum((x1-y1)**2))

def knn(X,Y,query_point, k=5):
	vals = []
	# print(query_point.shape)
	m = X.shape[0]

	for i in range(m):
		dis = dist(query_point,X[i])
		vals.append((dis,Y[i]))
		
	vals = sorted(vals)

	vals = vals[:k]
	vals = np.array(vals)

	counts = np.unique(vals[:,1], return_counts=True)
	predict = counts[0][counts[1].argmax()]
	
	return predict
################################

# # Initialize camera
# # cap = cv2.VideoCapture(0)
# cap = cv2.VideoCapture(0)
# cap.release()
# cap = cv2.VideoCapture(0)

# Load the haar cascade for frontal face
face_cascade = cv2.CascadeClassifier('./FaceRecognition/haarcascade_frontalface_alt.xml')

dataset_path = '../Files/'

face_data = []
labels = []
class_id = 0

# Dataset prepration
names ={}

for fx in os.listdir("./FaceRecognition/Files/"):
	if fx.endswith(".npy"):
        #Create a mapping btw class_id and name
		names[class_id] = fx[:-4]
		#print("loaded",fx)
		data_item = np.load("./FaceRecognition/Files/"+fx)
		face_data.append(data_item)
        
        
        #Create Labels for the class
		target = class_id*np.ones((data_item.shape[0],))
		class_id+=1
		labels.append(target)

face_dataset = np.concatenate(face_data, axis=0)
face_labels = np.concatenate(labels, axis=0).reshape((-1, 1))
# print (face_labels.shape)
# print (face_dataset.shape)

# trainset = np.hstack((face_dataset, face_labels))
# print (trainset.shape)

# names = {
# 	0: 'Ambika',
# 	1: 'shivang',
# 	2: 'vasudev'
# }

font = cv2.FONT_HERSHEY_SIMPLEX

frame = cv2.imread('./public/upload/save.jpg')
# Convert frame to grayscale
gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

# Detect multi faces in the image
faces = face_cascade.detectMultiScale(gray, 1.3, 5)	
name_out=[]

for face in faces:
	x, y, w, h = face

	# Get the face ROI
	offset = 7
	face_section = frame[y:y+h+offset,x:x+w+offset]
	cv2.imwrite('./public/upload/temp.jpg',face_section)
	face_section = cv2.resize(face_section, (100, 100))
	# print(face_section.shape)
	out = knn(face_dataset,face_labels, face_section)

	# Draw rectangle in the original image
	cv2.putText(frame, names[int(out)],(x,y-10), cv2.FONT_HERSHEY_SIMPLEX,0.3,(255,0,0),1,cv2.LINE_AA)
	cv2.rectangle(frame, (x,y), (x+w,y+h), (211,211,211), 1)
	name_out.append(names[int(out)])

print(name_out)
cv2.imwrite('./public/upload/processed.jpg',frame)
