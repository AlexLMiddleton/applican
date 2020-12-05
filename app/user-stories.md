# User Stories - AppliCAN

### This is an applicant tracking and employee personnel management system.

## Types of Users:

- Applicants

- Technicians

- Administrators

### Applicants

Applicant should be able to:

- [x] Sign up
- [x] Log in
- [ ] Request a password reset by email
- [x] Create an application
- [x] Submit an application into the system
- [x] Edit their application
- [x] Delete their application
- [x] Browse open positions
- [x] Search for open positions with a variety of filters (job title, department)
- [x] Submit their application to positions
- [x] View the status of their application in a dashboard
- [x] Accept or reject interview requests in a dashboard

### Technicians

Technicians should be able to:

- [x] Log in
- [x] Create new position
- [x] View (read) a position
- [x] Update a position
- [x] Delete a position
- [x] Manually close a position
- [x] List all positions
- [x] Add description items
- [x] Delete description items
- [x] View applicants for current positions
- [x] Screen applicants for closed, unfilled positions
- [x] Search positions
- [x] Search applicants
- [x] Clear applicants for interview
- [x] Schedule interviews
- [x] Remove applicants from Cleared for Interview stage
- [x] Clear applicants for hire

### Administrators

- [x] Log in
- [x] Create, read, update, delete, and list applicants
- [ ] Create, read, update, delete, and list technicians
- [x] Create, read, update, delete, and list positions
- [x] Assign varying levels of privileges to users (i.e. user, technician, administrator)
- [ ] View usage logs
- [ ] Automatically close a position when the closing date arrives

### To-Do List

- Positions that are closed still appear in positions list when they're instantly redirected. They disappear on manual reload, though.
- Convert dates to MM/DD/YYYY formats (or something besides YYYY/MM/DD).
- After a position closes, remove it from the Positions list (/positions) and place it in the technician dashboard.
