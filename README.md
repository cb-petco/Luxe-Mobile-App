# Luxe Transfers - MVP

A production-style mobile-first web app for premium executive transport services.

## Features

### Customer Mode
- Request new trips with full booking details
- View upcoming and past trips
- Track trip status in real-time
- Receive notifications about bookings
- View driver and vehicle information
- Manage profile and preferences

### Driver Mode
- View daily schedule and assigned jobs
- Accept available jobs
- Update trip status through workflow
- Manage availability status
- View job details and customer information
- Navigate to pickup/dropoff locations

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context
- **Data**: Mock service layer with simulated API delays

## Project Structure

```
src/
├── components/         # Reusable UI components
├── context/           # App state management
├── data/              # Mock data
├── screens/
│   ├── customer/      # Customer-facing screens
│   └── driver/        # Driver-facing screens
├── services/          # Mock API service layer
└── types/             # TypeScript type definitions
```

## Getting Started

The app runs in demonstration mode with no authentication required.

1. Choose your mode (Customer or Driver) on the welcome screen
2. Explore the full booking and trip management flow
3. All data is stored in memory and resets on page reload

## Key Design Decisions

- **No Authentication**: Demo mode for easy testing
- **No Persistent Storage**: All data in memory
- **Mock Service Layer**: Simulates real API calls with delays
- **Easy API Integration**: Replace mock services with real endpoints later
- **Mobile-First**: Optimized for 375-430px width screens
- **Premium Design**: Dark navy/charcoal with gold accents

## Customer Flow

1. Request a trip with all details
2. Review booking and estimated fare
3. Submit booking request
4. Track status as it progresses
5. View completed trip history

## Driver Flow

1. Check availability status
2. View assigned jobs and available trips
3. Accept jobs
4. Update trip status (En Route → In Progress → Completed)
5. View customer contact information
