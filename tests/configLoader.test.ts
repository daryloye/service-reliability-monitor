import fs from "fs";
import * as yaml from "js-yaml";
import path from "path";
import { AppConfig, loadConfig, resetCache } from "../src/utils/configLoader";

jest.mock("fs");
jest.mock("js-yaml");

const CONFIG_PATH = path.join(process.cwd(), "src/config/services.yaml");

describe("configLoader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetCache();
  });

  test("loads and parses valid services.yaml correctly", () => {
    const mockConfig: AppConfig = {
      interval: 10,
      services: [
        {
          name: "test-service",
          url: "https://example.com/health",
          expectedVersion: "1.0.0",
        },
      ],
    };

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("services: {}");
    (yaml.load as jest.Mock).mockReturnValue(mockConfig);

    const result = loadConfig();

    expect(fs.existsSync).toHaveBeenCalledWith(CONFIG_PATH);
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(result.services.length).toBe(1);
    expect(result.services[0].name).toBe("test-service");
  });

  test("throws error when config file does not exist", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(() => loadConfig()).toThrow(
      `Config file not found at: ${CONFIG_PATH}`
    );
  });

  test("throws if services array is missing", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("invalid");
    (yaml.load as jest.Mock).mockReturnValue({}); // Missing "services"

    expect(() => loadConfig()).toThrow(
      "Invalid config format. Expected { services: [...] }"
    );
  });

  test("throws if service is missing required fields", () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue("bad");
    (yaml.load as jest.Mock).mockReturnValue({
      interval: 10,
      services: [
        { name: "incomplete-service" }, // Missing url + expectedVersion
      ],
    });

    expect(() => loadConfig()).toThrow(
      "Missing 'url' in services[0] (incomplete-service)"
    );
  });
});
