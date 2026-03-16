import {EnrollmentId, Semester, StudentId, CourseCode} from '../domain/types';

export interface StudentEnrolled {
  type: 'StudentEnrolled';
  enrollmentId: EnrollmentId;
  studentId: StudentId;
  courseCode: CourseCode;
  semester: Semester;
}

export interface EnrollmentCancelled {
  type: 'EnrollmentCancelled';
  enrollmentId: EnrollmentId;
  studentId: StudentId;
  courseCode: CourseCode;
  semester: Semester;
}

export interface CourseCapacityReached {
  type: 'CourseCapacityReached';
  courseCode: CourseCode;
  currentEnrolled: number;
  capacity: number;
}

export interface CourseFull {
  type: 'CourseFull';
  courseCode: CourseCode;
  capacity: number;
}

export type Event =
  | StudentEnrolled
  | EnrollmentCancelled
  | CourseCapacityReached
  | CourseFull;