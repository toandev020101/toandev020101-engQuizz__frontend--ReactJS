import * as yup from 'yup';

const notificationSchema = yup.object().shape({
  title: yup.string().required('Vui lòng nhập tiêu đề thông báo!'),
  content: yup.string().required('Vui lòng nhập nội dung thông báos!'),
});

export default notificationSchema;
