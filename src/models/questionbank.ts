// 
import { useState } from 'react';

// Interfaces for type safety
export interface Course {
    id: string;
    name: string;
    knowledgeAreas?: string[];
}
export interface KhoiKienThuc {
    id: string;
    name: string;
    createdAt?: Date;
  }

export interface Question {
    id: string;
    courseId: string;
    content: string;
    difficultyLevel: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
    khoiKienThucId: string;
    createdAt?: Date;
}

export interface TestPaper {
    id: string;
    courseName: string;
    questions: Question[];
    createdAt?: Date;
    questionId: string;
    cauTruc: Record<string, Record<string, number>>; 
}

export default () => {
    const [courses, setCourses] = useState<Course[]>(() => {
        const storedCourses = localStorage.getItem('courses');
        return storedCourses ? JSON.parse(storedCourses) : [];
    });

    const [questions, setQuestions] = useState<Question[]>(() => {
        const storedQuestions = localStorage.getItem('questions');
        return storedQuestions ? JSON.parse(storedQuestions) : [];
    });

    const [testPapers, setTestPapers] = useState<TestPaper[]>(() => {
        const storedTestPapers = localStorage.getItem('testPapers');
        return storedTestPapers ? JSON.parse(storedTestPapers) : [];
    });

    const [khoiKienThucs, setKhoiKienThucs] = useState<KhoiKienThuc[]>(() => {
        const storedKhoiKienThucs = localStorage.getItem('khoiKienThucs');
        return storedKhoiKienThucs ? JSON.parse(storedKhoiKienThucs) : [];
    });

    // Course Management
    const addCourse = (course: Course) => {
        const updatedCourses = [...courses, course];
        setCourses(updatedCourses);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
    };

    const deleteCourse = (courseId: string) => {
        const updatedCourses = courses.filter(course => course.id !== courseId);
        setCourses(updatedCourses);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));

        // Also delete questions associated with the course
        const updatedQuestions = questions.filter(question => question.courseId !== courseId);
        setQuestions(updatedQuestions);
        localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    };

    const updateCourse = (updatedCourse: Course) => {
        const updatedCourses = courses.map(course =>
            course.id === updatedCourse.id ? updatedCourse : course
        );
        setCourses(updatedCourses);
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
    };

    // Question Management
    const addQuestion = (question: Question) => {
        const updatedQuestions = [...questions, question];
        setQuestions(updatedQuestions);
        localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    };
    const deleteQuestion = (questionId: string) => {
        const updatedQuestions = questions.filter(q => q.id !== questionId);
        setQuestions(updatedQuestions);
        localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    };
    const updateQuestion = (updatedQuestion: Question) => {
        const updatedQuestions = questions.map(q => 
            q.id === updatedQuestion.id ? updatedQuestion : q
        );
        setQuestions(updatedQuestions);
        localStorage.setItem('questions', JSON.stringify(updatedQuestions));
    };
    
    // Question Statistics - Add this missing function
    const getQuestionStats = (courseId: string) => {
        const courseQuestions = questions.filter(q => q.courseId === courseId);
        
        // Calculate difficulty distribution
        const difficultyStats = {
            'Easy': 0,
            'Medium': 0,
            'Hard': 0,
            'Very Hard': 0
        };

        // Calculate knowledge area distribution
        const knowledgeAreaStats: { [key: string]: number } = {};

        courseQuestions.forEach(question => {
            // Count by difficulty
            difficultyStats[question.difficultyLevel]++;

            // Count by knowledge area
            if (knowledgeAreaStats[question.khoiKienThucId]) {
                knowledgeAreaStats[question.khoiKienThucId]++;
            } else {
                knowledgeAreaStats[question.khoiKienThucId] = 1;
            }
        });

        return {
            difficultyStats,
            knowledgeAreaStats
        };
    };

    // Test Paper Generation
    const generateTestPaper = (
        courseId: string,
        difficultyDistribution: { [key: string]: number },
        knowledgeAreaDistribution: { [key: string]: number }
    ) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) throw new Error('Course not found');

        const selectedQuestions: Question[] = [];
        const courseQuestions = questions.filter(q => q.courseId === courseId);

        // Calculate total questions needed
        let totalQuestionsNeeded = 0;
        Object.values(difficultyDistribution).forEach(count => {
            totalQuestionsNeeded += count;
        });

        // For each difficulty level
        for (const [difficulty, count] of Object.entries(difficultyDistribution)) {
            // Filter questions by difficulty
            const difficultyQuestions = courseQuestions.filter(q => q.difficultyLevel === difficulty);

            // Determine how many questions to select from each knowledge area
            const totalKnowledgeAreaWeight = Object.values(knowledgeAreaDistribution).reduce((sum, val) => sum + val, 0) || 1;


            // For each knowledge area
            for (const [knowledgeArea, weight] of Object.entries(knowledgeAreaDistribution)) {
                // Calculate the number of questions to get from this knowledge area
                const areaCount = Math.round((weight / totalKnowledgeAreaWeight) * count);

                if (areaCount > 0) {
                    // Get matching questions
                    const matchingQuestions = difficultyQuestions.filter(q => q.khoiKienThucId === knowledgeArea);

                    // Randomly select questions
                    const selectedAreaQuestions = matchingQuestions
                        .sort(() => 0.5 - Math.random())
                        .slice(0, areaCount);

                    selectedQuestions.push(...selectedAreaQuestions);
                }
            }
        }

        const newTestPaper: TestPaper = {
            id: `TEST_${Date.now()}`,
            courseName: course.name,
            questions: selectedQuestions,
            createdAt: new Date(),
            questionId: '',
            cauTruc: {
                difficultyDistribution,
                knowledgeAreaDistribution
            }
        };

        const updatedTestPapers = [newTestPaper, ...testPapers];
        setTestPapers(updatedTestPapers);
        localStorage.setItem('testPapers', JSON.stringify(updatedTestPapers));

        return newTestPaper;
    };

    // Search and Filter
    const searchQuestions = (
        courseId?: string,
        difficultyLevel?: string,
        khoiKienThucId?: string
    ) => {
        return questions.filter(q =>
            (!courseId || q.courseId === courseId) &&
            (!difficultyLevel || q.difficultyLevel === difficultyLevel) &&
            (!khoiKienThucId || q.khoiKienThucId === khoiKienThucId)
        );
    };

    return {
        courses,
        questions,
        testPapers,
        addCourse,
        deleteCourse,
        updateCourse,
        addQuestion,
        updateQuestion,
        deleteQuestion, 
        generateTestPaper,
        setTestPapers,
        searchQuestions,
        getQuestionStats,
        khoiKienThucs,
        addKhoiKienThuc: (khoiKienThuc: KhoiKienThuc) => {
            const updatedKhoiKienThucs = [...khoiKienThucs, khoiKienThuc];
            setKhoiKienThucs(updatedKhoiKienThucs);
            localStorage.setItem('khoiKienThucs', JSON.stringify(updatedKhoiKienThucs));
        },
        deleteKhoiKienThuc: (khoiKienThucId: string) => {
            const deletedKhoiKienThuc = khoiKienThucs.find(khoiKienThuc => khoiKienThuc.id === khoiKienThucId);
            const updatedKhoiKienThucs = khoiKienThucs.filter(khoiKienThuc => khoiKienThuc.id !== khoiKienThucId);
            setKhoiKienThucs(updatedKhoiKienThucs);
            localStorage.setItem('khoiKienThucs', JSON.stringify(updatedKhoiKienThucs));

             // Also delete questions associated with the knowledge area
             if (deletedKhoiKienThuc) {
                const updatedQuestions = questions.filter(question => question.khoiKienThucId !== deletedKhoiKienThuc.id);
                setQuestions(updatedQuestions);
                localStorage.setItem('questions', JSON.stringify(updatedQuestions));
            }
        },
        updateKhoiKienThuc: (updatedKhoiKienThuc: KhoiKienThuc) => {
            const updatedKhoiKienThucs = khoiKienThucs.map(khoiKienThuc =>
                khoiKienThuc.id === updatedKhoiKienThuc.id ? updatedKhoiKienThuc : khoiKienThuc
            );
            setKhoiKienThucs(updatedKhoiKienThucs);
            localStorage.setItem('khoiKienThucs', JSON.stringify(updatedKhoiKienThucs));
        },
        addTestPaper: (testPaper: TestPaper) => {
            const updatedTestPapers = [...testPapers, testPaper];
            setTestPapers(updatedTestPapers);
            localStorage.setItem('testPapers', JSON.stringify(updatedTestPapers));
        },
        getTestPaper: (testPaperId: string) => {
            return testPapers.find(paper => paper.id === testPaperId);
        },
        updateTestPaper: (updatedTestPaper: TestPaper) => {
            const updatedTestPapers = testPapers.map(paper =>
                paper.id === updatedTestPaper.id ? updatedTestPaper : paper
            );
            setTestPapers(updatedTestPapers);
            localStorage.setItem('testPapers', JSON.stringify(updatedTestPapers));
        },
        deleteTestPaper: (testPaperId: string) => {
            const updatedTestPapers = testPapers.filter(paper => paper.id !== testPaperId);
            setTestPapers(updatedTestPapers);
            localStorage.setItem('testPapers', JSON.stringify(updatedTestPapers));
        },
    };
};
