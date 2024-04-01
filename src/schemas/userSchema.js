import * as yup from 'yup';

const today = new Date();
const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

const userSchema = yup.object().shape({
  fullname: yup.string().required('Vui lòng nhập họ và tên !'),
  gender: yup.string().required('Vui lòng nhập giới tính!'),
  birth_day: yup
    .date()
    .required('Vui lòng nhập ngày sinh!')
    .max(maxDate, 'Bạn phải đủ 18 tuổi trở lên để đăng ký.'),
  email: yup.string().email().required('Vui lòng nhập email!'),
  password: yup.string(),
  confirm_password: yup.string().oneOf([yup.ref('password')], 'Không khớp mật khẩu!'),
});

export default userSchema;
