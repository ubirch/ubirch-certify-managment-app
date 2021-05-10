export interface IErrorResponse {
    version: string;
    ok: boolean;
    errorType: string;
    validationErrors: [
        {
            name: string;
            error: string;
        }
    ];
}

// {
//     "version":"1.0",
//     "ok":false,
//     "errorType":"BadRequest",
//     "validationErrors": [
//       {
//         "name":"filterColumnStatus",
//         "error":"Invalid 'filterColumnStatus': invalid"
//       }
//     ]
// }
