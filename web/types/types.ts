export type Admin = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    createdAt: string,
    enabled: boolean
}

export type Classroom = {
    id: number,
    name: string,
    description: string,
    manageById: number,
    available: boolean,
    createdAt: string,
    roomNumber: number,
    classroomTypeId: number
}

export type FileMetaDatas = {
    id: number,
    filenmame: string,
    uploadedAt: string,
    uri: string
}

export type Item = {
    id: number,
    name: string,
    description: string,
    manageById: number,
    available: boolean,
    createdAt: string,
    serialNumber: number,
    itemTypeId: number
}

export type ItemType = {
    id: number,
    name: string,
    createdById: string,
    createdAt: string
}

export type Notification = {
    id: number,
    message: string,
    createdAt: string
}

export type Professor = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    createdAt: string,
    enabled: boolean,
    subjectIds: number[]
}

export type Report = {
    id: number,
    description: string,
    resourceId: number,
    reportedById: number,
    status: string,
    createdAt: string
}

export type Reservation = {
    id: number,
    startDate: string,
    endDate: string,
    reserveById: number,
    ressourceId: number,
    status: string,
    validationDate: string,
    createdAt: string
}

export type ReservationGroup = {
    id: number,
    name: string,
    createdAt: string
}

export type ReservationGroupStudent = {
    id: number,
    reservationGroupId: number,
    studentId: number,
    role: string,
    createdAt: string
}

export type Resource = {
    id: number,
    name: string,
    description: string,
    manageById: number,
    available: boolean,
    createdAt: string
}

export type Student = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    createdAt: string,
    enabled: boolean,
    studentNumber: number
}

export type Subject = {
    id: number,
    name: string,
    description: string,
    professorIds: number[]
}

export type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    createdAt: string,
    enabled: boolean,
    type: string
}

export type UserNotification = {
    id: number,
    notificationId: number,
    userId: number,
    readAt: string,
    isRead: boolean
}