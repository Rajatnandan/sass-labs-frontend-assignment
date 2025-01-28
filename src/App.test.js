import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// Updated mock data with amt.pledged and percentage.funded
const mockData = [
  { "s.no": 1, "amt.pledged": 1000, "percentage.funded": 20 },
  { "s.no": 2, "amt.pledged": 3000, "percentage.funded": 100 },
  { "s.no": 3, "amt.pledged": 700, "percentage.funded": 70 },
  { "s.no": 4, "amt.pledged": 2000, "percentage.funded": 40 },
  { "s.no": 5, "amt.pledged": 4000, "percentage.funded": 67 },
  { "s.no": 6, "amt.pledged": 1500, "percentage.funded": 75 },
];
// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true, // Simulate a successful response
    json: () => Promise.resolve(mockData), // Return mock data
  })
);
describe("Kickstarter Projects App", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  test("fetches and displays projects", async () => {
    render(<App />);

    // Ensure the fetch function is called
    expect(fetch).toHaveBeenCalledTimes(1);

    // Wait for the data to be rendered
    await waitFor(() => {
      expect(screen.getByText("100")).toBeInTheDocument(); // Percentage of project 2
      expect(screen.getByText("3000")).toBeInTheDocument(); // Amount pledged for project 2
    });
  });

  test("displays correct number of rows per page", async () => {
    render(<App />);

    // Wait for rows to load
    await waitFor(() => {
      const rows = screen.getAllByRole("row"); // Includes header row
      expect(rows.length).toBe(6); // 5 data rows + 1 header row
    });
  });

  test("pagination works correctly", async () => {
    render(<App />);

    // Wait for rows to load
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(6); // 5 data rows + 1 header row
    });

    // Click the next button
    const nextButton = screen.getByLabelText("Next Page");
    fireEvent.click(nextButton);

    // Check the rows for the second page
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(3); // 2 data rows + 1 header row
    });
  });
});
