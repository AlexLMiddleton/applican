import create from "zustand";

export const applicantsStore = create(set => ({
  userSelected: 0,
  applicants: [],
  fetchApplicants: () => {
    fetch("http://localhost:3000/applicants")
      .then(response => response.json())
      .then(response => set({ applicants: response }));
  }
}));

export const applicantStore = create(set => ({
  userSelected: 0,
  applicant: {},
  fetchApplicant: id => {
    fetch(`http://localhost:3000/applicant/${id}`)
      .then(response => response.json())
      .then(response => set({ applicant: response }));
  }
}));

export const positionsStore = create(set => ({
  positions: [],
  fetchPositions: () => {
    fetch("http://localhost:3000/positions")
      .then(response => response.json())
      .then(response => set({ positions: response }));
  }
}));

export const positionStore = create(set => ({
  position: [],
  fetchPosition: () => {
    fetch("http://localhost:3000/position/:id")
      .then(response => response.json())
      .then(response => set({ position: response }));
  }
}));
