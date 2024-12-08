export const sendResponse = (
  res: any,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  const response: {
      success: boolean;
      message: string;
      data?: any;
  } = { 
      success, 
      message 
  };

  if (data) {
      response.data = data; // Add the data property only when needed
  }

  res.status(statusCode).json(response);
};
