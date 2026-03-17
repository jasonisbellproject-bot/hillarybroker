export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get from localStorage first
  const token = localStorage.getItem('sb-access-token');
  if (token) return token;
  
  // Fallback to cookies
  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('sb-access-token=')
  );
  
  if (accessTokenCookie) {
    return accessTokenCookie.split('=')[1];
  }
  
  return null;
}

export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  
  if (!token) {
    return {
      'Content-Type': 'application/json',
    };
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
} 