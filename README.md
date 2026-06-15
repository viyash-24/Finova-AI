# Finova AI 💰

### AI-Powered Personal Finance Management Platform

Finova AI is a modern AI-powered personal finance management platform that helps users track expenses, manage budgets, achieve savings goals, monitor bills, and receive intelligent financial recommendations through a multi-agent AI architecture.

The platform combines financial analytics, budgeting tools, goal tracking, and AI-driven insights to help users make smarter financial decisions and improve their overall financial health.

---

## 🚀 Features

### 💵 Expense Management

* Add and manage daily expenses
* Categorize expenses automatically
* Track spending history
* Monitor spending trends
* View category-wise expenses

### 📊 Smart Analytics Dashboard

* Expense distribution analysis
* Spending trend visualization
* Monthly financial reports
* Budget performance tracking
* Financial health scoring

### 🎯 Financial Goal Management

* Create savings goals
* Track progress toward goals
* Receive AI-generated saving plans
* Predict goal completion timelines

### 💰 Budget Planning

* Set monthly budgets
* Define category spending limits
* Compare budget vs actual spending
* Receive overspending alerts

### 🔔 Bill Management

* Manage recurring bills
* Monitor due dates
* Receive bill reminders
* Track overdue payments

### 🤖 AI Financial Assistant

* Personalized financial recommendations
* Spending analysis
* Budget optimization
* Savings strategies
* Investment guidance
* Income growth suggestions

---

## 🎯 Problem Statement

Managing personal finances is often difficult due to fragmented tracking methods, lack of financial visibility, and limited access to personalized financial advice.

Most users struggle to understand spending habits, maintain budgets, achieve savings goals, and make informed financial decisions.

---

## 💡 Solution

Finova AI addresses these challenges by acting as an intelligent financial assistant that helps users:

* Track expenses efficiently
* Understand spending behavior
* Improve savings habits
* Monitor financial goals
* Manage recurring bills
* Receive AI-powered recommendations
* Build long-term financial discipline

---

## 🤖 AI Agent Architecture

Finova AI uses a multi-agent AI system powered by LangChain and Google Gemini.

### Expense Analysis Agent

**Responsibilities**

* Analyze spending behavior
* Categorize expenses
* Detect overspending
* Identify spending trends
* Generate financial insights

**Outputs**

* Spending trends
* Category analysis
* Overspending alerts
* Monthly comparisons

---

### Savings Planner Agent

**Responsibilities**

* Create personalized budgets
* Generate savings plans
* Suggest spending reductions
* Improve saving habits

**Outputs**

* Budget recommendations
* Savings opportunities
* Goal-based planning
* Financial discipline strategies

---

### Investment Suggestion Agent

**Responsibilities**

* Analyze financial surplus
* Evaluate risk profile
* Suggest investment opportunities

**Outputs**

* Investment recommendations
* Risk assessment
* Growth strategies

---

### Bill Reminder Agent

**Responsibilities**

* Monitor recurring bills
* Track due dates
* Detect overdue payments

**Outputs**

* Bill reminders
* Payment notifications
* Monthly bill summaries

---

### Income Growth Agent

**Responsibilities**

* Suggest additional income sources
* Recommend freelancing opportunities
* Provide passive income ideas

**Outputs**

* Side hustle recommendations
* Skill monetization strategies
* Income growth suggestions

---

## 🛠 Technology Stack

| Layer             | Technology           |
| ----------------- | -------------------- |
| Frontend          | Next.js + TypeScript |
| Styling           | Tailwind CSS         |
| Backend           | FastAPI              |
| Database          | PostgreSQL           |
| Authentication    | Clerk                |
| AI Framework      | LangChain            |
| AI Model          | Gemini API           |
| State Management  | Zustand              |
| Charts            | Recharts             |
| API Communication | Axios                |

---

## 📸 Screenshots

### Dashboard

*Add dashboard screenshot here*

### Analytics

*Add analytics screenshot here*

### AI Assistant

*Add AI chat screenshot here*

### Goals Management

*Add goals page screenshot here*

---

## ⚙️ Installation

### Prerequisites

Make sure the following software is installed:

* Node.js (v20 or later)
* Python (v3.11 or later)
* PostgreSQL
* Git

---

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/finova-ai.git

cd finova-ai
```

---

### 2. Configure PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE finova_ai;
```

---

### 3. Backend Setup

Navigate to backend directory:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/finova_ai

GEMINI_API_KEY=your_gemini_api_key

CLERK_SECRET_KEY=your_clerk_secret_key

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start backend server:

```bash
uvicorn app.main:app --reload
```

Backend server will run at:

```text
http://localhost:8000
```

---

### 4. AI Service Setup

Navigate to ai-service directory:

```bash
cd ai-service
```

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start AI service server:

```bash
uvicorn main:app --reload --port 8001
```

AI service will run at:

```text
http://localhost:8001
```

---

### 5. Frontend Setup

Navigate to frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Run development server:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:3000
```

---

## 🔑 Required Services

### Clerk Authentication

1. Create a Clerk account.
2. Create a new application.
3. Copy the Publishable Key.
4. Copy the Secret Key.
5. Add them to environment variables.

### Google Gemini API

1. Create an API key using Google AI Studio.
2. Add the API key to backend environment variables.

---

## 📖 Usage Guide

### Step 1

Create an account or sign in using Clerk authentication.

### Step 2

Add income and expense records.

### Step 3

Create monthly budgets.

### Step 4

Set financial goals.

### Step 5

Add recurring bills and due dates.

### Step 6

Visit the Analytics page to view:

* Spending trends
* Budget performance
* Financial health score
* AI-generated recommendations

### Step 7

Use the AI Assistant to ask questions such as:

* How can I save more money?
* Why did I overspend this month?
* What investment options suit me?
* How can I increase my income?

---

## 📊 Key AI Insights

The analytics engine provides:

* Spending behavior analysis
* Overspending detection
* Savings recommendations
* Budget optimization
* Investment guidance
* Income growth suggestions
* Financial health evaluation

---

## 🔒 Security Features

* Clerk Authentication
* Protected Routes
* JWT Verification
* Environment Variable Protection
* Secure API Communication
* PostgreSQL Data Security

---

## 📈 Future Enhancements

* Bank Account Integration
* OCR Receipt Scanning
* Mobile Application
* Multi-Currency Support
* Voice Assistant
* Investment Portfolio Tracking
* Predictive Financial Forecasting
* Email and SMS Notifications

---

## 👨‍💻 Author

**Viyashan**

Software Engineer

Portfolio: https://www.viyashan.me

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourprofile

---

## 📄 License

This project is licensed under the MIT License.

Feel free to use, modify, and distribute this project in accordance with the license terms.
