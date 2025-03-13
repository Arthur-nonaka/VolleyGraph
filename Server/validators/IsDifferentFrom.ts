import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
  } from 'class-validator';
  
  export function IsDifferentFrom(
    property: string,
    validationOptions?: ValidationOptions
  ) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isDifferentFrom',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const relatedValue = (args.object as any)[property];
            return value !== relatedValue; // Ensure values are different
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} cannot be the same as ${property}`;
          },
        },
      });
    };
  }
  