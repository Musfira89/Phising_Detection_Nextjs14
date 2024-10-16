import * as tf from '@tensorflow/tfjs';
import { NextResponse } from 'next/server';


try {
console.log('Loading model...');
const modelPath = await tf.loadLayersModel('/train_Model/model.json');
console.log('Model loaded successfully');
 // Your other logic
} catch (error) {
  console.error('Error loading model:', error);
}
// Placeholder function to convert URL into features
function preprocessUrl(url) {
  const features = [/* calculated values */];
  
  // Placeholder: Ensure correct preprocessing here
  console.log('Preprocessed features:', features);
  return features;
}


export async function POST(req) {
  try {
    const { url } = await req.json();
    const processedFeatures = preprocessUrl(url);

    // Load the model
    const model = await tf.loadLayersModel(`file://${modelPath}`);

    // Prepare the input tensor
    const input = tf.tensor2d([processedFeatures], [1, processedFeatures.length]);

    // Make prediction
    const prediction = model.predict(input);
    const result = prediction.dataSync()[0] > 0.5 ? 'Phishing' : 'Legitimate';

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}