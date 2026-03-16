import { Student, Course, Enrollment } from '../domain/entities';
import { StudentId, CourseCode, Semester, EnrollmentId, createStudentId, createCourseCode, createEmail, createCredits, createSemester, generateEnrollmentId } from '../domain/types';
import { EventEmitter } from '../infrastructure/observer';
import { StudentEnrolled, EnrollmentCancelled, CourseCapacityReached, CourseFull } from '../infrastructure/events';

export class EnrollmentService {
  private students = new Map<string, Student>();
  private courses = new Map<string, Course>();
  private enrollments = new Map<string, Enrollment>();
  private emitter: EventEmitter;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }


  createStudent(id: string, name: string, email: string): Student | Error {
    const studentId = createStudentId(id);
    if (studentId instanceof Error) return studentId;


    const emailValidated = createEmail(email);
    if (emailValidated instanceof Error) return emailValidated;


    if (this.students.has(id)) return new Error('Student already exists');


    const student = Student.create({id, name, email});
    if (student instanceof Error) return student;
    this.students.set(id, student);
    return student;
  }


  createCourse(code: string, name: string, credits: number, capacity: number): Course | Error {
    if (this.courses.has(code)) return new Error('Course already exists');


    const course = Course.create({code, name, credits, capacity});
    if (course instanceof Error) return course;
    this.courses.set(code, course);
    return course;
  }


  enrollStudent(studentId: string, courseCode: string, semester: string): Enrollment | Error {
    const student = this.students.get(studentId);
    if (!student) return new Error('Student not found');


    const course = this.courses.get(courseCode);
    if (!course) return new Error('Course not found');


    const semesterValidated = createSemester(semester);
    if (semesterValidated instanceof Error) return semesterValidated;


    if (course.enrolledCount >= course.capacity) {
      return new Error('Course is full');
    }


    const currentCredits = student.creditsFor(semesterValidated);
    if (currentCredits + course.credits > 18) {
      return new Error('Student would exceed 18 credits for the semester');
    }


    const existing = Array.from(this.enrollments.values()).find(e => 
      e.studentId === student.id && e.courseCode === course.code && e.semester === semesterValidated && e.status === 'ACTIVE'
    );
    if (existing) return new Error('Student already enrolled in this course for this semester');


    const enrollment = Enrollment.create({studentId, courseCode, semester});
    if (enrollment instanceof Error) return enrollment;

    this.enrollments.set(enrollment.id, enrollment);


    const addResult = student.addCredits(semesterValidated, course.credits);
    if (addResult instanceof Error) return addResult;
    course.enroll();


    const event: StudentEnrolled = {
      type: 'StudentEnrolled',
      enrollmentId: enrollment.id,
      studentId: student.id,
      courseCode: course.code,
      semester: semesterValidated
    };
    this.emitter.emit(event);


    if (course.enrolledCount === course.capacity - 1) {
      const capacityEvent: CourseCapacityReached = {
        type: 'CourseCapacityReached',
        courseCode: course.code,
        currentEnrolled: course.enrolledCount,
        capacity: course.capacity
      };
      this.emitter.emit(capacityEvent);
    }


    if (course.enrolledCount === course.capacity) {
      const fullEvent: CourseFull = {
        type: 'CourseFull',
        courseCode: course.code,
        capacity: course.capacity
      };
      this.emitter.emit(fullEvent);
    }


    return enrollment;
  }


  dropEnrollment(enrollmentId: string): boolean | Error {
    const enrollment = this.enrollments.get(enrollmentId);
    if (!enrollment) return new Error('Enrollment not found');
    if (enrollment.status !== 'ACTIVE') return new Error('Enrollment is not active');


    const student = this.students.get(enrollment.studentId);
    const course = this.courses.get(enrollment.courseCode);
    if (!student || !course) return new Error('Related student or course not found');


    const cancelResult = enrollment.cancel();
    if (cancelResult instanceof Error) return cancelResult;


    const dropResult = student.dropCredits(enrollment.semester, course.credits);
    if (dropResult instanceof Error) return dropResult;
    course.drop();


    const event: EnrollmentCancelled = {
      type: 'EnrollmentCancelled',
      enrollmentId: enrollment.id,
      studentId: enrollment.studentId,
      courseCode: enrollment.courseCode,
      semester: enrollment.semester
    };
    this.emitter.emit(event);


    return true;
  }


  getStudent(id: string): Student | undefined {
    return this.students.get(id);
  }


  getCourse(code: string): Course | undefined {
    return this.courses.get(code);
  }


  getEnrollment(id: string): Enrollment | undefined {
    return this.enrollments.get(id);
  }


  getEnrollmentsForStudent(studentId: string): Enrollment[] {
    return Array.from(this.enrollments.values()).filter(e => e.studentId === studentId);
  }
}