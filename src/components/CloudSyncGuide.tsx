import React, { useState } from "react";

export default function CloudSyncGuide() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      title: "Create GitHub Personal Access Token",
      content: (
        <div className="space-y-3">
          <p>1. Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub Settings → Developer settings → Personal access tokens</a></p>
          <p>2. Click "Generate new token (classic)"</p>
          <p>3. Give it a name like "ML Roadmap Sync"</p>
          <p>4. Select the <code className="bg-gray-100 px-1 rounded">gist</code> scope</p>
          <p>5. Click "Generate token" and copy it</p>
        </div>
      )
    },
    {
      title: "Configure Cloud Sync",
      content: (
        <div className="space-y-3">
          <p>1. Paste your GitHub token in the "GitHub Personal Access Token" field</p>
          <p>2. Leave "Existing Gist ID" empty for first setup</p>
          <p>3. Set auto-sync interval (5 minutes is recommended)</p>
          <p>4. Click "Save Configuration"</p>
        </div>
      )
    },
    {
      title: "Upload Your Progress",
      content: (
        <div className="space-y-3">
          <p>1. Click "☁️⬆️ Upload Progress" to save your current progress to the cloud</p>
          <p>2. Your data will be stored in a private GitHub Gist</p>
          <p>3. You'll get a confirmation when upload is successful</p>
        </div>
      )
    },
    {
      title: "Access from Other Browsers",
      content: (
        <div className="space-y-3">
          <p>1. Open the ML Roadmap Tracker on any other browser/device</p>
          <p>2. Go to Cloud Sync setup and enter the same GitHub token</p>
          <p>3. Click "☁️⬇️ Download Progress" to load your synced data</p>
          <p>4. Enable auto-sync to keep everything synchronized</p>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-2xl mr-2">📚</span>
        Cloud Sync Setup Guide
      </h3>

      <div className="flex items-center justify-between mb-6">
        {steps.map((_, index) => (
          <React.Fragment key={index}>
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer transition-colors ${
                currentStep === index + 1 
                  ? 'bg-blue-600 text-white' 
                  : currentStep > index + 1 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}
              onClick={() => setCurrentStep(index + 1)}
            >
              {currentStep > index + 1 ? '✓' : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-1 mx-2 rounded ${
                  currentStep > index + 1 ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="min-h-[200px]">
        <h4 className="text-lg font-semibold text-gray-700 mb-3">
          Step {currentStep}: {steps[currentStep - 1].title}
        </h4>
        <div className="text-gray-600">
          {steps[currentStep - 1].content}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">🔒 Privacy:</span> Your data is stored in a private GitHub Gist that only you can access. 
          No one else can see your progress.
        </p>
      </div>
    </div>
  );
}
