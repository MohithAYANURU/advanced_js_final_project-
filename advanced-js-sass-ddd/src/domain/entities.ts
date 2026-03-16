import {
  StudentId,
  CourseCode,
  Email,
  Credits,
  Semester,
  EnrollmentId,
  createStudentId,
  createCourseCode,
  createEmail,
  createCredits,
  createSemester,
  generateEnrollmentId,
}  from './types';

// object factory
export interface CourseProps {
  code: string;
  name: string;
  credits: number;
  capacity: number;
}

// entity 1: Course
export class Course {
    private constructor(
        public readonly code: CourseCode,
        public readonly name: string,
        public readonly credits: Credits,
        public readonly capacity: number ,
        private _enrolledCount: number = 0
    ) {}

    static create(props: CourseProps): Course | Error {
    const code = createCourseCode(props.code);
    if (code instanceof Error) return code;
 
    if (!props.name.trim()) {
      return new Error("Course name cannot be empty");
    }
 
    const credits = createCredits(props.credits);
    if (credits instanceof Error) return credits;
 
    if (props.capacity < 1 || props.capacity > 200) {
      return new Error(
        `Course capacity must be between 1 and 200, got ${props.capacity}`
      );
    }
 
    return new Course(code, props.name.trim(), credits, props.capacity);
  }


  // computed properties

   get enrolledCount(): number {
    return this._enrolledCount;
  }
 
  get availableSpots(): number {
    return this.capacity - this._enrolledCount;
  }
 
  get isFull(): boolean {
    return this._enrolledCount >= this.capacity;
  }

  get isAt80Percent(): boolean {
    return this._enrolledCount / this.capacity >= 0.8;
  }


  // increment enrolled count
  enroll(): void {
    if (this.isFull) {
        throw new Error(`Cannot enroll in ${this.code}: course is full`);
    }
    this._enrolledCount+=1;
    }


  // decremant enrolled count
  drop(): void {
    if (this._enrolledCount === 0) {
      throw new Error(`Cannot drop ${this.code}: no students enrolled`);
    }
    this._enrolledCount-=1;
  }

  toString(): string {
    return `[Course ${this.code}] "${this.name}" — ${this.credits} credits, ${this._enrolledCount}/${this.capacity} enrolled`;
  }
}










// object factory 
export interface StudentProps {
  id: string;
  name: string;
  email: string;
}



// entity 2: Student    
export class Student {
    private constructor(
        public readonly id: StudentId,
        public readonly name: string,
        public readonly email: Email ,
        private readonly _creditsBySemester: Map<Semester, number> = new Map()

    ) {}

    static create(props: StudentProps): Student | Error {
        const id = createStudentId(props.id);
        if (id instanceof Error) return id;
        if (!props.name.trim()) {
            return new Error("Student name cannot be empty");   
        }

        const email = createEmail(props.email); 
        if (email instanceof Error) return email;
        return new Student(id, props.name.trim(), email);   
    }

    // computed properties  
    creditsFor(semester: Semester): number {
    return this._creditsBySemester.get(semester) ?? 0;
  }

    ExceedCreditLimit(semester: Semester, credits: Credits): boolean {
    return this.creditsFor(semester) + credits > 18;
  }

    //crud
    addCredits(semester: Semester, credits: Credits): void | Error {
    if (this.ExceedCreditLimit(semester, credits)) {
      const current = this.creditsFor(semester);
      return new Error(
        `Student ${this.id} already has ${current} credits in ${semester}. ` +
          `Adding ${credits} would exceed the 18-credit limit`
      );
    }
    const current = this.creditsFor(semester);
    this._creditsBySemester.set(semester, current + credits);
  }


    dropCredits(semester: Semester, credits: Credits): void | Error {
        const current= this.creditsFor(semester);
        if (current - credits < 0) {
            return new Error(
                `Student ${this.id} only has ${current} credits in ${semester}. ` +
                `Dropping ${credits} would result in negative credits`
            );
        }
        this._creditsBySemester.set(semester, current - credits);
    }

    toString(): string {
        return `[Student ${this.id}] "${this.name}" <${this.email}>`;   
    }


}









// entity 3: Enrollment

export type EnrollmentStatus = "ACTIVE" | "CANCELLED";

export interface EnrollmentProps {
  studentId: string;
  courseCode: string;
  semester: string;
}


export class Enrollment {
  private constructor(
    public readonly id: EnrollmentId,
    public readonly studentId: StudentId,
    public readonly courseCode: CourseCode,
    public readonly semester: Semester,
    private _status: EnrollmentStatus = "ACTIVE"
  ) {}

  static create(props: EnrollmentProps): Enrollment | Error {
    const studentId = createStudentId(props.studentId);
    if (studentId instanceof Error) return studentId;
 
    const courseCode = createCourseCode(props.courseCode);
    if (courseCode instanceof Error) return courseCode;
 
    const semester = createSemester(props.semester);
    if (semester instanceof Error) return semester;
 
    const id = generateEnrollmentId();
 
    return new Enrollment(id, studentId, courseCode, semester);
  }
  

  // computed properties
    get status(): EnrollmentStatus {
    return this._status;
  }
 
    get isActive(): boolean {
    return this._status === "ACTIVE";
  }
    


  cancel(): void | Error {
    if (!this.isActive) {
      return new Error(
        `Enrollment ${this.id} is already cancelled and cannot be cancelled again`
      );
    }
    this._status = "CANCELLED";
  }
 
  get uniqueKey(): string {
    return `${this.studentId}::${this.courseCode}::${this.semester}`;
  }


  toString(): string {
    return (
      `[Enrollment ${this.id}] Student ${this.studentId} → ` +
      `Course ${this.courseCode} (${this.semester}) [${this._status}]`
    );
  }





}