# Digital Customer Registration & Record Management System

A mobile application designed to replace traditional paper-based customer registration with a digital, offline-first workflow.

The application will allow staff to enter and manage customer information, generate printable PDF records, and synchronize data with a central database when a network connection is available.

## Project Overview

Many organizations collect customer information manually using paper forms. This process can be time-consuming, difficult to maintain, and prone to data-entry errors.

This project aims to digitize the process through a mobile application that supports structured data collection, local storage, PDF generation, and centralized record management.

### Key Objectives

- Replace paper-based customer registration with a mobile application.
- Store customer information in a structured format.
- Support offline data entry and local record access.
- Generate printable PDF documents for individual customer records.
- Synchronize records between multiple devices through a central backend.
- Support spreadsheet-compatible data exports.
- Maintain data integrity, security, and reliability through automated testing and backups.

## Technology Stack

| Component | Technology |
|---|---|
| Mobile Application | React Native, Expo, TypeScript |
| Local Database | SQLite |
| Backend API | FastAPI |
| Backend Validation | Pydantic |
| Central Database | PostgreSQL |
| ORM | SQLAlchemy |
| Database Migrations | Alembic |
| Backend Testing | pytest, HTTPX |
| PDF Generation | Expo Print |
| Version Control | Git |

## System Architecture

The application follows an offline-first architecture.

```text
+----------------------------------+
|         Mobile Application       |
|       React Native + Expo        |
|                                  |
|  Registration Form               |
|  Customer Records                |
|  PDF Generation and Printing     |
|  Local SQLite Database           |
+----------------+-----------------+
                 |
                 | Local Network / API
                 |
+----------------v-----------------+
|           FastAPI Backend        |
|                                  |
|  REST API                        |
|  Validation and Business Logic   |
|  Authentication and Sync         |
+----------------+-----------------+
                 |
                 |
+----------------v-----------------+
|           PostgreSQL             |
|                                  |
|  Central Customer Records        |
|  User and Related Data           |
+----------------------------------+
```

The mobile application will store records locally so that core functionality remains available without internet access. When connectivity is available, pending changes can be synchronized with the central backend.

The backend and PostgreSQL database will initially be deployed on a local computer and accessed by authorized devices on the organization's network.

## Planned Features

### 1. Customer Registration

- Digital customer registration form.
- Structured fields and input validation.
- Save and edit customer information.
- Unique identifiers for customer records.

### 2. Customer Record Management

- View saved customer records.
- Search and retrieve records.
- View and edit individual customer details.
- Maintain consistent record formats.

### 3. Offline Support

- Store records locally using SQLite.
- Access previously saved records without internet.
- Generate PDFs from locally available data.
- Queue changes for synchronization when connectivity returns.

### 4. PDF Generation and Printing

- Generate a PDF for an individual customer.
- Use a consistent, print-friendly document layout.
- Support PDF preview, saving, sharing, and printing where available.

### 5. Backend and Database

- REST APIs for customer record management.
- Centralized storage using PostgreSQL.
- Request validation and appropriate error handling.
- Authentication and authorization for staff.
- Synchronization between mobile devices.

### 6. Testing and Reliability

- Unit and integration tests using pytest.
- API testing using HTTPX.
- Database validation and migration testing.
- Offline synchronization and retry testing.
- Backup and recovery procedures.

### 7. Data Export

- Export customer records in a spreadsheet-compatible format.
- Maintain consistent columns and structured output.
- Support authorized access to exported data.

## Repository Structure

The repository is expected to follow this structure as development progresses.

```text
customer-registration-system/
├── mobile/
│   └── React Native + Expo application
├── backend/
│   ├── app/
│   ├── tests/
│   ├── migrations/
│   └── pyproject.toml
├── deployment/
│   ├── compose.yaml
│   └── backup/
├── docs/
│   ├── requirements.md
│   └── api-contract.md
├── .gitignore
└── README.md
```

The directory structure may evolve as implementation progresses.

## Development Approach

Development will be organized into milestones:

1. **Project Foundation:** Requirements, repository setup, and initial project structure.
2. **Mobile Frontend:** Navigation, registration forms, record management, and user interface.
3. **Local Storage:** SQLite integration and offline record persistence.
4. **Backend and Database:** FastAPI endpoints, PostgreSQL schema, and database migrations.
5. **PDF Generation:** Printable customer documents and local printing.
6. **Synchronization:** Reliable data exchange between mobile devices and the central database.
7. **Testing and Deployment:** Automated testing, local-network deployment, backups, and Android release builds.

## Initial Deployment

The initial deployment will use a local-network setup to avoid cloud hosting costs.

- The mobile application will run on Android devices.
- FastAPI and PostgreSQL will run on an office computer.
- Authorized devices will communicate with the backend over the local network.
- Local customer entry and PDF generation will remain available without internet.

Cloud deployment may be considered in the future if remote access or higher availability becomes necessary.

## Security and Data Integrity

The project will follow these principles:

- Validate data on both the mobile application and backend.
- Keep database credentials and server secrets out of the mobile application.
- Restrict access to authorized users.
- Prevent duplicate records during synchronization.
- Protect customer information stored on devices and the server.
- Maintain database backups and test recovery procedures.

## Project Status

**Status:** Initial development and project setup.

The repository is being established, and features will be implemented incrementally according to the project milestones.

## Contribution and Collaboration

Development is organized around three areas:

- **Mobile Frontend:** React Native, Expo, UI, local storage, and PDF functionality.
- **Backend and Database:** FastAPI, PostgreSQL, API development, and synchronization.
- **Testing and Integration:** pytest, integration testing, deployment, and reliability.

Team members should use feature branches, submit changes through pull requests, and keep project documentation up to date.

## License

The project license has not yet been selected. Licensing will be determined by the organization before public distribution.
