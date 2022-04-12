import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  message: string;
  errorFields: {
      [key: string]: string[]
  }
}

function generateBodyError (
  err: ErrorResponse, 
  field: string, 
  errorName: string
): ErrorResponse {
  const result = Object.assign(err || {
      message: 'body error',
      errorFields: {},
  }, {});

  if(!result.errorFields[field]) {
      result.errorFields[field] = [];
  }

  result.errorFields[field] = [
      ...result.errorFields[field],
      errorName
  ];
  
  return result;
}

interface bodyCheckerArgObj {
  type? : string;
  requirement? : boolean;
  enum?: string[];
}

interface bodyCheckerArg {
  [key: string]: string | bodyCheckerArgObj;
}

export default function bodyChecker(arg: bodyCheckerArg){
  return (req: Request, res: Response, next: NextFunction) => {
      const {body} = req;
      let err = null;

      for(let k in arg) {
          let v: string | bodyCheckerArgObj = arg[k];
          
          if(typeof v === 'string') {
              if(v && body[k] && typeof body[k] !== v) {
                  err = generateBodyError(err, k, 'type_err');
              }
          } else { // obj
              if(v.requirement && !body[k]) {
                  err = generateBodyError(err, k, 'requirement_err');;
              } 
              if(v.type && typeof body[k] !== v.type) {
                  err = generateBodyError(err, k, 'type_err');;
              } 
              if(v.enum && !v.enum.includes(body[k])) {
                  err = generateBodyError(err, k, `enum_err ::: enable value is (${v.enum})`);
              }
          }    
      }


      if(err) {
          res.status(400).json(err);
          return;
      };

      next();
  }
}