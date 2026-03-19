import { EventEmitter } from './src/infrastructure/observer';
import { EnrollmentService } from './src/application/enrollmentService';
import { StudentEnrolled, EnrollmentCancelled, CourseCapacityReached, CourseFull } from './src/infrastructure/events';

const emitter = new EventEmitter();
const service = new EnrollmentService(emitter);


emitter.subscribe('StudentEnrolled', (event: StudentEnrolled) => {
  console.log(`StudentEnrolled — ${event.studentId} enrolled in ${event.courseCode} (${event.semester})`);
});


emitter.subscribe('EnrollmentCancelled', (event: EnrollmentCancelled) => {
  console.log(`EnrollmentCancelled — ${event.enrollmentId} (student ${event.studentId})`);
});


emitter.subscribe('CourseCapacityReached', (event: CourseCapacityReached) => {
  console.log(`CourseCapacityReached — ${event.courseCode} is at ${event.currentEnrolled}/${event.capacity}`);
});


emitter.subscribe('CourseFull', (event: CourseFull) => {
  console.log(`CourseFull — ${event.courseCode} is now full (capacity ${event.capacity})`);
});


function createOrFail<T>(result: T | Error, label: string): T {
  if (result instanceof Error) {
    console.error(`${label} failed:`, result.message);
    process.exit(1);
  }
  return result;
}


function runScenarios() {
  console.log('\n=== Scenario 1: Basic enroll ===');
  const student1 = createOrFail(service.createStudent('STU123456', 'Alice Johnson', 'alice@university.edu'), 'Create student');
  const course1 = createOrFail(service.createCourse('CS101', 'Intro to Computer Science', 3, 2), 'Create course');
  createOrFail(service.enrollStudent('STU123456', 'CS101', 'Fall 2024'), 'Enroll student');

  console.log('\n=== Scenario 2: Capacity reached ===');
  createOrFail(service.createStudent('STU234567', 'Bob Smith', 'bob@university.edu'), 'Create second student');
  createOrFail(service.enrollStudent('STU234567', 'CS101', 'Fall 2024'), 'Enroll second student');

  console.log('\n=== Scenario 3: Course full ===');
  createOrFail(service.createStudent('STU345678', 'Charlie Brown', 'charlie@university.edu'), 'Create third student');
  const failEnroll = service.enrollStudent('STU345678', 'CS101', 'Fall 2024');
  if (failEnroll instanceof Error) {
    console.log('Expected failure:', failEnroll.message);
  }

  console.log('\n=== Scenario 4: Credit limit ===');
  createOrFail(service.createCourse('MATH301', 'Advanced Calculus', 4, 30), 'Create course');
  createOrFail(service.createCourse('PHYS201', 'Physics II', 4, 30), 'Create course');
  createOrFail(service.createCourse('CHEM101', 'Chemistry I', 4, 30), 'Create course');
  createOrFail(service.createCourse('BIO101', 'Biology I', 4, 30), 'Create course');
  createOrFail(service.createCourse('ENG101', 'English Composition', 3, 30), 'Create course');

  createOrFail(service.enrollStudent('STU123456', 'MATH301', 'Fall 2024'), 'Enroll (MATH301)');
  createOrFail(service.enrollStudent('STU123456', 'PHYS201', 'Fall 2024'), 'Enroll (PHYS201)');
  createOrFail(service.enrollStudent('STU123456', 'CHEM101', 'Fall 2024'), 'Enroll (CHEM101)');
  createOrFail(service.enrollStudent('STU123456', 'BIO101', 'Fall 2024'), 'Enroll (BIO101)');

  const creditLimitFail = service.enrollStudent('STU123456', 'ENG101', 'Fall 2024');
  if (creditLimitFail instanceof Error) {
    console.log('Expected failure:', creditLimitFail.message);
  }

  console.log('\n=== Scenario 5: Drop enrollment ===');
  const enrollments = service.getEnrollmentsForStudent('STU123456');
  const active = enrollments.find(e => e.status === 'ACTIVE');
  if (active) {
    createOrFail(service.dropEnrollment(active.id), 'Drop enrollment');
  }
}

runScenarios();
