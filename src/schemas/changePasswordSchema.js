import * as yup from 'yup';

const changePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Mật khẩu cũ phải có ít nhất 6 ký tự!')
    .required('Vui lòng nhập mật khẩu cũ!')
    .min(6, 'Mật khẩu cũ phải có ít nhất 6 ký tự!'),
  new_password: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới!')
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự!')
    .notOneOf([yup.ref('password')], 'Mật khẩu mới phải khác mật khẩu cũ!'),
  confirm_new_password: yup
    .string()
    .required('Vui lòng nhập xác nhận mật khẩu mới!')
    .oneOf([yup.ref('new_password')], 'Không khớp mật khẩu mới!'),
});

export default changePasswordSchema;
