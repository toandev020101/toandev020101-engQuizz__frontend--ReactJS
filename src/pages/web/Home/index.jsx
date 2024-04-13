import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import TitlePage from './../../../components/TitlePage';

const Home = () => {
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      height={'calc(100vh - 75px)'}
      padding="0 160px"
    >
      <TitlePage title="EngQuizz - Trang chủ" />
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} gap={'50px'}>
        <Box flex={1}>
          <Typography variant="h3" marginBottom={'10px'}>
            Kết nối tư duy, truyền cảm hứng đổi mới.
          </Typography>
          <Typography variant="h6" marginBottom={'30px'}>
            Hãy đến với trang web của chúng tôi để trải nghiệm sự đổi mới, kết nối và cơ hội phát
            triển khả năng của bạn. Chúng tôi cung cấp các nguồn lực bạn cần để tự tin vượt qua kỳ
            thi và đạt được thành công.
          </Typography>

          <Link to="/de-thi">
            <Button variant="contained" sx={{ minWidth: '150px' }}>
              Vào thi
            </Button>
          </Link>
        </Box>

        <Box flex={1}>
          <img src="/images/slide.png" alt="slide.png" width={'100%'} />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
