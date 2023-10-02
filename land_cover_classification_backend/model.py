import cv2
import numpy as np
import matplotlib.pyplot as plt
import torch
import tqdm
import segmentation_models_pytorch as smp
import albumentations as album

def reverse_one_hot(image):
    x = np.argmax(image, axis = -1)
    return x

def get_validation_augmentation(h,w):
    train_transform = [
        album.CenterCrop(height=h, width=w, always_apply=True),
    ]
    return album.Compose(train_transform)

def colour_code_segmentation(image, label_values):
    colour_codes = np.array(label_values)
    x = colour_codes[image.astype(int)]

    return x

def to_tensor(x, **kwargs):
    return x.transpose(2, 0, 1).astype('float32')

def get_preprocessing(preprocessing_fn=None):
    _transform = []
    if preprocessing_fn:
        _transform.append(album.Lambda(image=preprocessing_fn))
    _transform.append(album.Lambda(image=to_tensor, mask=to_tensor))
        
    return album.Compose(_transform)

def predict_mask(img):
    gpu = torch.device("cuda")
    cpu = torch.device("cpu")

    model = torch.load('./best_model_backup.pth', map_location=gpu)

    select_class_rgb_values =  [[0, 0, 0], [0, 255, 0], [255, 255, 0]]
    
    h = img.shape[0] - (img.shape[0])%16
    w = img.shape[1] - (img.shape[1])%16
    
    print(h,w)
    
    ENCODER = 'resnet50'
    ENCODER_WEIGHTS = 'imagenet'
    preproces_fn = smp.encoders.get_preprocessing_fn(ENCODER, ENCODER_WEIGHTS)
    preproces = get_preprocessing(preproces_fn)
    augment = get_validation_augmentation(h,w)

    img = augment(image=img)['image']
    img = preproces(image=img)['image']

    img = torch.from_numpy(img).to(gpu).unsqueeze(0)
    pred_mask = model(img).detach().squeeze().cpu().numpy()
    pred_mask = np.transpose(pred_mask,(1,2,0))
    pred_mask = colour_code_segmentation(reverse_one_hot(pred_mask), select_class_rgb_values)
   
    forest = 0
    agri = 0
    others = 0
    for i in range(len(pred_mask)):
        for j in range(len(pred_mask[i])):
            if((pred_mask[i][j] == [255,255,0]).all()):
                agri += 1
            if((pred_mask[i][j] == [0,255,0]).all()):
                forest += 1
            if((pred_mask[i][j] == [0,0,0]).all()):
                others += 1
    total = agri+forest+others            
    
    classes = {'agriculture':agri*100/total,'forest':forest*100/total,'others':others*100/total}
    
    torch.cuda.empty_cache()
    return (pred_mask,classes)

# img = cv2.cvtColor(cv2.imread("train/990619_sat.jpg"), cv2.COLOR_BGR2RGB)

# mask,classes = predict_mask(img)
# plt.subplot(1,2,1)
# plt.imshow(img)
# plt.subplot(1,2,2)
# plt.imshow(mask)
# print(classes)