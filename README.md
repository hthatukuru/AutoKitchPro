# Moodify
DJarvis - Good or bad, an app to accompany you always!

DJarvis - You're very own personal music assistant was made with the noble purpose of helping you cheer up or continue you're mood of relaxation. It integrates with the Microsoft Cognitive API to give the user a careful analysis of his/her feeling's and then alleivates, calms, or continues the current state of mind by playing music
with respect to a parameter called valence which is integrated with the Spotify Web API.
A valence parameter ranging from 0-1 helps convey the positivity of the song and compares with the Cognitive APIs detection of emotions of the person and this coherency helps achieve the ideal playlist whether the user is sad or happy.

## Node Deployment and Blob Storage

A major part of this product is to integrate this with extremely reliant Azure services. Blobstorage specifically was very useful in uploading the base64 encoded image directly drawn from pixels on an HTML5 Canvas which was directly snapped from the webcam of the user.
This real time data gives a precise analysis of the user's emotions at every moment. These pictures are then stored as data points to check for ease or distress that the user may be caused.

## Spotify Dynamic Playlist Generation

Based on the paramter received the user's preferences of songs are analysed from his/her playlists and a suitable playlist is made so that the user experiences relief from stress or calmness.

### Next Steps:

This project can be scaled to group events and playing off music of overlapping playlists. This personal DJ will help in relieving financial strain on events that cannot afford professional people playing on site.

### Technologies Used:
Microsoft Cognitive Emotions API, Spotify Web API, Microsoft Azure(Node Deployment, BlobStorage)

Back-End:
Node.js

Front-end:
Javascript, AJAX, HTML/CSS

### Link: https://www.youtube.com/watch?v=lgpRvocmgg0
