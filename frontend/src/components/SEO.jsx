import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => (
  <Helmet>
    <title>{title ? `${title} | SkillSwap` : 'SkillSwap - Exchange Skills, Grow Together'}</title>
    <meta
      name="description"
      content={description || 'Connect with people to exchange skills and learn from each other on SkillSwap.'}
    />
    {keywords && <meta name="keywords" content={keywords} />}
    <meta property="og:title" content={title || 'SkillSwap'} />
    <meta property="og:description" content={description || 'Exchange skills and grow together'} />
    <meta property="og:type" content="website" />
  </Helmet>
);

export default SEO;
