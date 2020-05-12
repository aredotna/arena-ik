import axios from "axios";

export interface S3UploadPolicy {
  key: string;
  AWSAccessKeyId: string;
  acl: string;
  success_action_status: string;
  policy: string;
  signature: string;
  bucket: string;
}

export const buildFormDataFromBlob = ({
  blob,
  policy,
}: {
  blob: File;
  policy: S3UploadPolicy;
}): FormData => {
  const formData = new FormData();

  formData.append("Content-Type", "image/png");
  formData.append("key", policy.key);
  formData.append("AWSAccessKeyId", policy.AWSAccessKeyId);
  formData.append("acl", policy.acl);
  formData.append("success_action_status", policy.success_action_status);
  formData.append("policy", policy.policy);
  formData.append("signature", policy.signature);
  formData.append("file", blob, `filename-${Date.now()}.png`);

  return formData;
};

export const parseLocationFromS3Response = (data: string) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(data, "text/xml");
  return parsed.getElementsByTagName("Location")[0].childNodes[0].nodeValue;
};

export const uploadFile = ({
  blob,
  policy,
  onDone = () => {},
}: {
  blob: File;
  policy: S3UploadPolicy;
  onFileProgress?: (progress: number) => any;
  onDone?: (url?: string | null) => any;
}): Promise<{
  blob: File;
  url: string | undefined | null;
}> => {
  const formData = buildFormDataFromBlob({ blob, policy });

  return axios
    .post(policy.bucket, formData, {
      responseType: "text",
    })
    .then(({ data }) => parseLocationFromS3Response(data))
    .then((url) => {
      onDone(url);
      return { blob, url };
    });
};
