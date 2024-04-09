import * as yup from 'yup';

const testSchema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập tên đề thi!'),
  start_date: yup.date().required('Vui lòng nhập ngày bắt đầu!'),
  end_date: yup
    .date()
    .required('Vui lòng nhập ngày kết thúc!')
    .when(
      'start_date',
      (startDate, schema) =>
        startDate && schema.min(startDate, 'Ngày kết thúc phải sau ngày bắt đầu!'),
    ),
  exam_time: yup
    .number()
    .required('Vui lòng nhập thời gian làm bài!')
    .moreThan(0, 'Thời gian làm bài phải lớn hơn 0!')
    .when('start_date', (startDate, schema) => {
      return schema.test({
        test: function (value) {
          const endDate = this.parent.end_date;
          if (startDate && endDate) {
            const timeDifferenceInMinutes = (new Date(endDate) - new Date(startDate)) / (1000 * 60); // tính theo phút
            return value <= timeDifferenceInMinutes;
          }
          return true;
        },
        message:
          'Thời gian làm bài phải nhỏ hơn hoặc bằng khoảng thời gian từ ngày bắt đầu đến ngày kết thúc!',
      });
    }),

  easy_quantity: yup.number().integer().moreThan(0, 'Số câu dễ phải lớn hơn 0!'),
  average_quantity: yup.number().integer().moreThan(0, 'Số câu trung bình phải lớn hơn 0!'),
  difficult_quantity: yup.number().integer().moreThan(0, 'Số câu khó phải lớn hơn 0!'),
  mix_question: yup.boolean(),
  mix_answer: yup.boolean(),
  show_exam: yup.boolean(),
  show_result: yup.boolean(),
  show_answer: yup.boolean(),
});

export default testSchema;
