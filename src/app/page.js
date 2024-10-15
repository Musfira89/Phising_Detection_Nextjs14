"use client";  // Ensure this is the first line to enable client-side rendering

import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';

export default function SpamDetectionForm() {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load TensorFlow.js model
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('/tfjs_model/model.json');
        setModel(loadedModel);
        setLoading(false);
      } catch (error) {
        console.error('Error loading the model:', error);
      }
    };
    loadModel();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (model) {
      // Prepare input for the model (adjust the tensor shape based on your trained model's input format)
      const inputTensor = tf.tensor2d([[name.length, email.length, message.length]], [1, 3]);
      
      // Predict spam or not (assumes model returns some kind of score)
      const prediction = model.predict(inputTensor);
      const spamPrediction = prediction.dataSync()[0];  // Example of how to get the prediction result

      console.log('Spam Prediction:', spamPrediction);

      if (spamPrediction > 0.5) {
        alert('This message might be spam!');
      } else {
        alert('This message is not spam.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Spam Detection Form</h1>
      
      {loading ? (
        <p>Loading model...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium">Name</label>
            <input
              type="text"
              id="name"
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium">Email</label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-medium">Message</label>
            <textarea
              id="message"
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
              placeholder="Enter your message"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
