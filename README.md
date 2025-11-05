>> FarCloud

FarCloud is a full-stack web application that allows users to upload, view, and manage images in the cloud using AWS S3. It provides a simple, intuitive interface to handle images efficiently with controlled uploads, deletions, and real-time synchronization.



> Overview

The application integrates a React frontend with a Node.js and Express backend to communicate with Amazon S3. Users can upload exactly four images at a time, automatically manage old uploads, and delete existing images directly from the user interface.

This project demonstrates practical use of AWS services, REST APIs, and frontend-backend communication for real-world cloud storage solutions.



> Features

- Upload exactly four images to AWS S3 at a time.
- Automatically delete older images when new uploads occur.
- View all images currently stored in your S3 bucket.
- Delete four images at once directly from the S3 gallery.
- Prevent uploads if images already exist in the bucket.
- Responsive layout with a clean, modern design.
- Smooth loading animations for better user experience.


> Tech Stack

- Frontend : React.js, Axios, CSS 
- Backend : Node.js, Express.js 
- Cloud : AWS S3 
- Hosting : Render (Backend) and Vercel (Frontend) 
- API : Picsum Photos API 



> Environment Variables

> Backend (.env)


AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name
PORT=5000


### Frontend (.env)

REACT_APP_API_URL=http://localhost:5000




> Local Setup

Follow these steps to run the project locally:

1. Clone the repository:
   
   git clone https://github.com/yourusername/farcloud.git
   cd farcloud
   

2. Install dependencies for both backend and frontend:
   
   cd server && npm install
   cd ../client && npm install
   

3. Start the development environment:
   
   cd ..
   npm run dev
   

4. Open your browser and go to:
  
   http://localhost:3000
 


> Deployment

- The backend can be hosted on Render by linking the repository and configuring the environment variables.
- The frontend can be hosted on Vercel or Netlify by building the client application using:
  
  npm run build
  
  and then deploying the generated `build` folder.



> Error Handling

During development, the following issues were identified and resolved:
- AWS S3 permission and access denial errors.
- Backend network errors and connection refusals.
- Handling incorrect upload conditions (less or more than four images).
- UI inconsistencies after image selection.
- Slow image loading times resolved with random pagination and skeleton loaders.



> Future Enhancements

- Integration with AWS CloudFront for faster image delivery.
- Add user authentication for secure access.
- Image optimization and compression before upload.
- User-based S3 folders for personalized image storage.


> Author

Developed by Durga Prasad

-Full Stack Developer in Training  



