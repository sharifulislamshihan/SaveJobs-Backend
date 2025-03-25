// sharedData.ts
let generatedMessage: string = "";

export const setGeneratedMessage = (message: string): void => {
    generatedMessage = message;

    ////console.log("message set successfully", generatedMessage);
    
};



export const getGeneratedMessage = (): string => {
    return generatedMessage;
    //console.log("getting message", generatedMessage);
    
};
