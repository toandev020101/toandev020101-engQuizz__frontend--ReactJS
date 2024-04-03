import * as yup from 'yup';

const questionSchema = yup.object().shape({
  content: yup.string().required('Vui lòng nhập nội dung câu hỏi!'),
  level: yup.string(),
});

export default questionSchema;
