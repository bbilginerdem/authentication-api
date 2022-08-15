import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First name is required',
    }),
    lastName: string({
      required_error: 'Last name is required',
    }),
    password: string({
      required_error: 'Password is required',
    }).min(6, "Password must be at least 6 characters"),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email("Not a valid email address")
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Password and password confirmation must match',
    path: ['passwordConfirmation']
  })
});

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  })
})

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email("Not a valid email address"),
  })
})

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({
      required_error: 'Password is required',
    }).min(6, "Password must be at least 6 characters"),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Password and password confirmation must match',
    path: ['passwordConfirmation']
  })
})

//since it is type, we use capital letters in the beginning of the name
export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
