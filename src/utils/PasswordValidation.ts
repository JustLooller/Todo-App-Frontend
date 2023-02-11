export function validatePassword(password: string): boolean{
    if(password.length < 8)
        return false;
    
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*)(_+\-=\[\]{};':"\\|,.<>\/?]/;
    
    return lowercaseRegex.test(password) && uppercaseRegex.test(password) && numberRegex.test(password) && specialCharRegex.test(password);
  }

  