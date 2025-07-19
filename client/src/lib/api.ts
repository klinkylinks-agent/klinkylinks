import { apiRequest } from "./queryClient";

// Dashboard API
export async function getDashboardStats(userId: number) {
  const response = await apiRequest("GET", `/api/dashboard/stats/${userId}`);
  return response.json();
}

export async function getRecentSimilarityMatches(userId: number) {
  const response = await apiRequest("GET", `/api/dashboard/recent-similarity-matches/${userId}`);
  return response.json();
}

// Content API
export async function uploadContent(formData: FormData) {
  const response = await fetch("/api/content/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getContentItems(userId: number) {
  const response = await apiRequest("GET", `/api/content/${userId}`);
  return response.json();
}

// Similarity Match API
export async function getSimilarityMatches(userId: number) {
  const response = await apiRequest("GET", `/api/similarity-matches/${userId}`);
  return response.json();
}

export async function createDmcaTemplate(matchId: number) {
  const response = await apiRequest("POST", `/api/similarity-matches/${matchId}/dmca-template`);
  return response.json();
}

// DMCA Template API
export async function getDmcaTemplates(userId: number) {
  const response = await apiRequest("GET", `/api/dmca-templates/${userId}`);
  return response.json();
}

export async function completeTemplate(templateId: number, completedContent: string) {
  const response = await apiRequest("POST", `/api/dmca-templates/${templateId}/complete`, {
    completedContent
  });
  return response.json();
}

// Monitoring API
export async function startManualScan(userId: number, contentId?: number) {
  const response = await apiRequest("POST", "/api/monitoring/manual-scan", {
    userId,
    contentId,
  });
  return response.json();
}

// Auth API
export async function registerUser(userData: { username: string; email: string; password: string }) {
  const response = await apiRequest("POST", "/api/auth/register", userData);
  return response.json();
}

export async function loginUser(credentials: { email: string; password: string }) {
  const response = await apiRequest("POST", "/api/auth/login", credentials);
  return response.json();
}

// Subscription API
export async function createSubscription(userId: number, email: string, priceId: string) {
  const response = await apiRequest("POST", "/api/create-subscription", {
    userId,
    email,
    priceId,
  });
  return response.json();
}
