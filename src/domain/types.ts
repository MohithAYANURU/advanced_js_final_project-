// 6 branded types with smart constructors (return `Type | Error`)

type Brand<K, T> = K & { __brand: T };

export type StudentId=Brand<string, 'StudentID'>;
export type CourseCode=Brand<string, 'CourseID'>;
export type Email=Brand<string, 'Email'>;
export type Credits=Brand<number, 'Credits'>;
export type Semester=Brand<string, 'Semester'>;
export type EnrollmentId=Brand<string, 'EnrollmentID'>; 


export function createStudentId(value: string): StudentId | Error {
  if (/^STU\d{6}$/.test(value)) {
    return value as StudentId;
  }
  return new Error(
    `Invalid StudentId "${value}". Expected format: STU######  (e.g. STU123456)`
  );
}



export function createCourseId(value: string): CourseCode | Error {
    if (/^[A-Z]{2,4}\d{3}$/.test(value)) {
    return value as CourseCode;
  }
  return new Error(
    `Invalid CourseCode "${value}". Expected 2–4 uppercase letters + 3 digits (e.g. CS101, MATH301)`
  );
}


export function createEmail(value: string): Email | Error {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return value as Email;  
    }
    return new Error(
        `Invalid Email "${value}". Expected format: user@domain.com`
    );
}



const VALID_CREDITS = [1, 2, 3, 4, 5, 6] as const;
type ValidCredits = typeof VALID_CREDITS[number];

export function createCredits(value: number): Credits | Error {   
    if (VALID_CREDITS.includes(value as ValidCredits)) {        
        return value as Credits;
    }
    return new Error(
        `Invalid Credits "${value}". Expected one of: ${VALID_CREDITS.join(', ')}`
    );
}


export function createSemester(value: string): Semester | Error {
    if (/^(Fall|Spring| Summer) \d{4}$/.test(value)) {
        return value as Semester;
    }
    return new Error(
        `Invalid Semester "${value}". Expected format: "Fall 2024", "Spring 2025", or "Summer 2024"`
    );

}

export function createEnrollmentId(value: string): EnrollmentId | Error {
    if (/^ENR\d{6}$/.test(value)) {
        return value as EnrollmentId;
    }
    return new Error(
        `Invalid EnrollmentId "${value}". Expected format: ENR######  (e.g. ENR123456)`
    );
}


let _counter = 0;
export function generateEnrollmentId(): EnrollmentId {
    const id = `ENR-${Date.now()}-${_counter++}`;   
    return id as EnrollmentId;
}


