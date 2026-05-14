export interface Vehicle {
  id: string;
  driverId: string; // Required. Must be a real driver.
  type: "bus" | "ferry";
  routeNumber: string;
  routeName: string;
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  crowdLevel: "empty" | "moderate" | "crowded" | "full";
  status: "active" | "delayed" | "inactive";
  lastUpdated: string;
  path?: {lat: number, lng: number}[];
}

export interface UserSavedRoute {
  routeId: string;
  routeName: string;
  type: "school" | "college" | "tuition" | "work" | "general";
  savedAt: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  theme: "light" | "dark" | "system";
}
