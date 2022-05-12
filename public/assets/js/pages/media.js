"use strict";

stent.media = (function () {

  // entity = type
  let _medias = [

    {
      key: "ArticleMedia",
      name: "Article",
      description: "Share an article from the internet",
      icon: "/assets/img/media/article.svg",
      fontawsome:"fe-file-text",
      color: "#6300ff"
    },

    {
      key: "DocumentMedia",
      name: "Document",
      description: "Share a document. PDF, PPT, PPTX, DOC, DOCX. The file size cannot exceed 100 MB. The page limit is 300 pages. The word count limit is one million words.",
      icon: "/assets/img/media/document.svg",
      fontawsome:"fe-file",
      color: "#e57c13"
    },

    {
      key: "ImageMedia",
      name: "Image",
      description: "Share an image. JPG, JPEG, PNG, GIF (not animated). The file size cannot exceed 6,012 × 6,012 px.",
      icon: "/assets/img/media/image.svg",
      fontawsome:"fe-image",
      color: "#3888e8"
    },

    {
      key: "VideoMedia",
      name: "Video",
      description: "Share a video. ASF, AVI, FLV, MPEG-1 and MPEG-4, QuickTime, WebM, H264/AVC, MP4, VP8, WMV2 et WMV3. Size of the video 256 x 144 pixels à 4096 x 2304 pixels",
      icon: "/assets/img/media/video.svg",
      fontawsome:"fe-video",
      color: "#8aa80c"
    }

  ];

  const getMediaByKey = function (key) {
    return _medias.filter(media => media.key === key)[0];
  };

  return {
    get: function () {
      return _medias;
    },
    getMediaByKey
  };

})();
