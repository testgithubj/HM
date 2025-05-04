import * as yup from 'yup';

export const TaskSchema = yup.object({
  title: yup.string().required('Title Is required'),
  category: yup.string(),
  description: yup.string(),
  notes: yup.string(),
  assignmentTo: yup.string(),
  assignmentToLead: yup.string(),
  start: yup.string().required('Start Is required'),
  end: yup.string(),
  url: yup.string(),
  createBy: yup.string()
});
