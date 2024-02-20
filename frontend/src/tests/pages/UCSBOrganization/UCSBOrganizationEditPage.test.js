import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            orgCode: "testCode"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/ucsborganizations", { params: { orgCode: "testCode" } })
    });
  const queryClient = new QueryClient();
  test("renders header but table is not present", async () => {

      const restoreConsole = mockConsole();

      render(
          <QueryClientProvider client={queryClient}>
              <MemoryRouter>
                  <UCSBOrganizationEditPage />
              </MemoryRouter>
          </QueryClientProvider>
      );
      await screen.findByText("Edit UCSBOrganization");
      expect(screen.queryByTestId("UCSBDateForm-orgCode")).not.toBeInTheDocument();
      restoreConsole();
    });
  });
  describe("tests where backend is working normally", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/ucsborganizations", { params: { orgCode: "testCode" } }).reply(200, {
            orgCode: "testCode",
            orgTranslation: 'test',
            orgTranslationShort: "test",
            inactive: false
        });
        axiosMock.onPut('/api/ucsborganizations').reply(200, {
          orgCode: "testCode",
          orgTranslation: 'test 2',
          orgTranslationShort: "test 2",
          inactive: false
        });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("Is populated with the data provided", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await screen.findByTestId("UCSBOrganizationForm-orgCode");

        const orgField = screen.getByTestId("UCSBOrganizationForm-orgCode");
        const translationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        expect(orgField).toHaveValue("testCode");
        expect(translationShortField).toHaveValue("test");
        expect(orgTranslationField).toHaveValue("test");
        expect(inactiveField).not.toBeChecked();
        expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await screen.findByTestId("UCSBOrganizationForm-orgCode");

        const orgField = screen.getByTestId("UCSBOrganizationForm-orgCode");
        const translationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        expect(orgField).toHaveValue("testCode");
        expect(translationShortField).toHaveValue("test");
        expect(orgTranslationField).toHaveValue("test");
        expect(inactiveField).not.toBeChecked();
        expect(submitButton).toBeInTheDocument();

        fireEvent.change(orgField, { target: { value: 'testCode' } });
        fireEvent.change(translationShortField, { target: { value: 'test 2' } });
        fireEvent.change(orgTranslationField, { target: { value: "test 2" } });

        fireEvent.click(submitButton);

        await waitFor(() => expect(mockToast).toBeCalled());
        expect(mockToast).toBeCalledWith("UCSBOrganization Updated - id: testCode name: test 2");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

        expect(axiosMock.history.put.length).toBe(1); // times called
        expect(axiosMock.history.put[0].params).toEqual({ orgCode: "testCode" });
        expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
            orgCode: 'testCode',
            orgTranslation: "test 2",
            orgTranslationShort: "test 2",
            inactive: false,
        })); 

    });
});
});
