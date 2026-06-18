// A simulated API response service
export const getStudentData = async (_studentId: string) => {
    return {
        attendance: 82,
        cgpa: 8.4,
        pendingFees: 45000,
        tasks: [
            { title: "Three.js Scene", course: "Graphics", due: "Tomorrow" }
        ]
    };
};