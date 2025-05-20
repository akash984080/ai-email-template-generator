
import { Columns2, Facebook, Frame, Framer, Image, Link2, PanelTop, Projector, RectangleEllipsis, SquareSplitVertical, Text, TextSelectionIcon, Twitter, SignatureIcon } from "lucide-react";


export default [
  {
    icon: RectangleEllipsis,
    label: 'Button',
    type: 'Button',
    content: 'Sample Button',
    url: '#',
    style: {
      textAlign: 'center',
      backgroundColor: '#007bff',
      color: '#ffffff',
      padding: '10px',
      width: '100%',
      fontSize: '16px',
      borderRadius: '0px',
      fontWeight: 'normal',
      objectFit: 'contain',


    },
    outerStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    }
  },
  {
    icon: TextSelectionIcon,
    type: 'Text',
    label: 'Text',
    textarea: [
      { text: "sample text", style: { color: "black" } },
    ]
    ,
    style: {
      backgroundColor: '#fff',
      color: '#000000',
      padding: '10px',
      textAlign: 'center',
      fontSize: '22px',
      fontWeight: 'normal',
      textTransform: 'uppercase'
    },
    outerStyle: {
      backgroundColor: '#fff',
      width: '100%'
    }
  },
  {
    icon: Image,
    type: 'Image',
    label: 'Image',
    imageUrl: "/image.png",
    alt: 'Image',
    url: '#',
    style: {
      backgroundColor: '#ffffff',
      padding: '10px',
      height: '50%',
      width: '70%',
      margin: '0px',
      borderRadius: '0px'
    },
    outerStyle: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      height: 'auto'
    }
  }
  ,
  {
    icon: Frame,
    type: 'Logo',
    label: 'Logo',
    imageUrl: "/logo.svg",
    alt: 'logo',
    url: '#',
    style: {
      backgroundColor: '#ffffff',
      padding: '10px',
      height: '30%',
      width: '30%',
    },
    outerStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      width: '100%'
    }
  },
  {
    icon: PanelTop,
    type: 'LogoHeader',
    label: 'Logo Header',
    imageUrl: "/logo.svg",
    alt: 'logo',
    url: '#',
    style: {
      backgroundColor: '#ffffff',
      padding: '10px',
      height: '40%',
      width: '40%',
    },
    outerStyle: {
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'center',
      backgroundColor: '#fff',
      width: '100%'
    }
  },


  {
    icon: SquareSplitVertical,
    type: 'Divider',
    label: 'Divider',
    content: '',
    style: {
      color: '#000000',
      margin: '10px',
      width: '100%'
    }
  }
  ,
  {
    type: 'SocialIcons',
    icon: Twitter,
    label: 'Social Icons',
    socialIcons: [

      {
        icon: 'https://cdn.iconscout.com/icon/free/png-512/free-github-logo-icon-download-in-svg-png-gif-file-formats--social-media-pack-logos-icons-2496133.png?f=webp&w=512',
        url: 'https://github.com/'
      },
      {
        icon: 'https://cdn.iconscout.com/icon/free/png-512/free-linkedin-logo-icon-download-in-svg-png-gif-file-formats--social-media-pack-logos-icons-498418.png?f=webp&w=512',
        url: 'https://www.linkedin.com/'
      }, {
        icon: 'https://cdn.iconscout.com/icon/free/png-512/free-youtube-logo-icon-download-in-svg-png-gif-file-formats--social-network-media-pack-logos-icons-3357686.png?f=webp&w=512',
        url: 'https://www.youtube.com/'
      }
    ],
    options: [
      {
        icon: 'https://cdn-icons-png.flaticon.com/128/2111/2111463.png',
        url: ''
      },
      {
        icon: 'https://cdn-icons-png.flaticon.com/128/5968/5968852.png',
        url: ''
      },
      {
        icon: 'https://cdn-icons-png.flaticon.com/128/5968/5968756.png',
        url: ''
      }
    ],
    style: {
      width: 50,
      height: 50,
      borderRadius: '50%',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, background-color 0.3s ease',
    },
    outerStyle: {
      display: 'flex',
      gap: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: '10px',
    }
  }



]