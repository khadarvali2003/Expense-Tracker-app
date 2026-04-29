# PRD.md  
# Expense Tracker Mobile App  
**Tech Stack:** React Native + Node.js + Express.js + MongoDB  
**Architecture:** Full Stack Mobile App with REST API  

---

# 1. Product Overview

Expense Tracker is a cross-platform mobile application that helps users manage daily expenses, categorize spending, and monitor financial habits.

Users can securely register/login, add/edit/delete expenses, and view dashboard analytics such as category-wise summaries.

The app focuses on:
- Simplicity
- Fast expense logging
- Clean analytics
- Reliable offline/user-state handling

---

# 2. Goals

## Primary Goals
- Help users track expenses easily
- Provide spending insights by category
- Maintain secure authentication
- Deliver smooth mobile UX

## Secondary Goals
- Offline data support
- Better financial discipline
- Clean scalable backend architecture

---

# 3. User Personas

## Persona 1: Student
Needs to manage monthly budget.

## Persona 2: Working Professional
Tracks daily spending and savings.

## Persona 3: Family User
Wants category-based reports.

---

# 4. Features

---

# 4.1 Authentication

## Register
User can create account using:
- Name
- Email
- Password

## Login
- Email + Password
- JWT Token authentication

## Logout
- Remove token
- Redirect to login screen

---

# 4.2 Expense Management

User can:

## Add Expense
Fields:
- Amount
- Category
- Date
- Note

## Edit Expense
Modify any existing record.

## Delete Expense
Delete with confirmation popup.

## Expense List
Display:
- Amount
- Category
- Date
- Note

Sort by:
- Latest
- Oldest
- Highest amount

---

# 4.3 Dashboard

Displays:

## Monthly Summary
Total spent this month.

## Category Breakdown
Examples:
- Food
- Travel
- Shopping
- Bills
- Health
- Others

## Charts
Pie chart / bar chart for category spend.

---

# 4.4 Offline / Error Handling

If no internet:

- Save request locally
- Retry sync later

OR minimum acceptable:

- Show offline banner
- Loading states
- Retry buttons
- API failure messages

---

# 5. Screens

## Mobile Screens

1. Splash Screen  
2. Login Screen  
3. Register Screen  
4. Dashboard Screen  
5. Add Expense Screen  
6. Edit Expense Screen  
7. Expense History Screen  
8. Profile Screen  

---

# 6. Navigation Structure

```txt
Auth Stack
 ├── Login
 └── Register

Main Stack / Bottom Tabs
 ├── Dashboard
 ├── Add Expense
 ├── History
 └── Profile