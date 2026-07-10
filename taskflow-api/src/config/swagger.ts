import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API de gestión de tareas con proyectos y usuarios',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateUserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', description: 'Nombre del usuario' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
            password: { type: 'string', minLength: 6, description: 'Contraseña' },
          },
        },
        UpdateUserInput: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nombre del usuario' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', description: 'Nombre del usuario' },
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
            password: { type: 'string', minLength: 6, description: 'Contraseña' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', description: 'Correo electrónico' },
            password: { type: 'string', description: 'Contraseña' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'Token JWT' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            ownerId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateProjectInput: {
          type: 'object',
          required: ['name', 'ownerId'],
          properties: {
            name: { type: 'string', description: 'Nombre del proyecto' },
            description: { type: 'string', description: 'Descripción del proyecto' },
            ownerId: { type: 'string', format: 'uuid', description: 'ID del usuario propietario' },
          },
        },
        UpdateProjectInput: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nombre del proyecto' },
            description: { type: 'string', description: 'Descripción del proyecto' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] },
            projectId: { type: 'string', format: 'uuid' },
            assignedTo: { type: 'string', format: 'uuid', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateTaskInput: {
          type: 'object',
          required: ['title', 'projectId'],
          properties: {
            title: { type: 'string', description: 'Título de la tarea' },
            description: { type: 'string', description: 'Descripción de la tarea' },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'], description: 'Estado de la tarea' },
            projectId: { type: 'string', format: 'uuid', description: 'ID del proyecto al que pertenece' },
            assignedTo: { type: 'string', format: 'uuid', description: 'ID del usuario asignado' },
          },
        },
        UpdateTaskInput: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Título de la tarea' },
            description: { type: 'string', description: 'Descripción de la tarea' },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'], description: 'Estado de la tarea' },
            assignedTo: { type: 'string', format: 'uuid', nullable: true, description: 'ID del usuario asignado' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            taskId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateCommentInput: {
          type: 'object',
          required: ['content', 'taskId'],
          properties: {
            content: { type: 'string', description: 'Contenido del comentario' },
            taskId: { type: 'string', format: 'uuid', description: 'ID de la tarea' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
