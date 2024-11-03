# Compliance Checker API

This project implements a Compliance Checker API that compares content from a target webpage against a specified compliance policy and returns findings about any compliance violations. The API collects and scrapes data from the webpage and policy page, and then uses the OpenAI API to analyze potential violations.

Features

	•	Webpage scraping: Gathers data from a given webpage URL.
	•	Policy scraping: Collects content from a specified policy URL.
	•	Compliance checking: Analyzes the webpage content against the policy for violations.

## Getting Started

### Prerequisites

	•	Node.js and npm installed on your machine.
	•	An OpenAI API key for accessing the OpenAI API.
    •	The token processing limit is set for this project as per premium, change the value as per your plan.
    

### Installation
1. Clone the repository:
```
        git clone <repository-url>
		cd compliance-checker
```
2. Install the dependencies:
```
        npm install
```
3.	Set up the environment variables:
			Create a .env file in the root directory and add your OpenAI API key:
```
        OPENAI_API_KEY=your_openai_api_key
        PORT=4079
```
4.	Build the project:
```
        npm run build
```

## Running the Application
After setting up the environment variables and installing dependencies, you can start the server:
```
        npm start
```
The server will start on the specified port (default is http://localhost:4079).

Usage

You can check compliance by sending a request to the `/compliance/check` endpoint. Replace the WebUrl and PolicyUrl parameters with the desired webpage and policy URLs.

### Example Request
```
curl --location 'http://localhost:4079/compliance/check?WebUrl=https%3A%2F%2Fmercury.com&PolicyUrl=https%3A%2F%2Fstripe.com%2Fdocs%2Ftreasury%2Fmarketing-treasury'
```
### Response

The API returns a structured report of compliance issues found on the target webpage, formatted for readability

### Project Structure

	•	src/: Contains the source code.
	•	service/ComplianceService.ts: The main logic for scraping and compliance checking.
	•	controller/ComplianceController.ts: Handles API requests and responses.
	•	route.ts: Defines API routes.
	•	dist/: Compiled output generated after running npm run build.

 