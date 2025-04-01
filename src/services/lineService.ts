import liff from '@line/liff';

// ใส่ LIFF ID ของคุณที่นี่
const LIFF_ID = import.meta.env.VITE_LIFF_ID;

export const initializeLiff = async (): Promise<void> => {
  try {
    await liff.init({ liffId: LIFF_ID as string });
    console.log('LIFF initialization completed successfully');
  } catch (error) {
    console.error('LIFF initialization failed', error);
    throw error;
  }
};

export const getLiffProfile = async () => {
  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }
  
  try {
    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage
    };
  } catch (error) {
    console.error('Failed to get LIFF profile', error);
    throw error;
  }
};

export const getLiffUID = async (): Promise<string | null> => {
  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }
  
  try {
    const profile = await liff.getProfile();
    return profile.userId;
  } catch (error) {
    console.error('Failed to get LINE UID', error);
    return null;
  }
};

export const isLiffLoggedIn = (): boolean => {
  return liff.isLoggedIn();
};

export const loginWithLiff = (): void => {
  liff.login();
};

export const logoutFromLiff = (): void => {
  liff.logout();
  window.location.reload();
};

export const openLiffScanQrCode = async (): Promise<string | null> => {
  try {
    if (!liff.isInClient()) {
      console.error('This function is only available in LINE app');
      return null;
    }
    
    const result = await liff.scanCodeV2();
    return result.value;
  } catch (error) {
    console.error('QR Code scanning failed', error);
    return null;
  }
};

export const isInLineApp = (): boolean => {
  return liff.isInClient();
};

