use std::io::BufWriter;
use std::num::NonZeroU32;
use std::path::Path;

use image::codecs::webp::WebPEncoder;
use image::io::Reader as ImageReader;

use fast_image_resize as fr;

pub fn resize_image(image: &Path, dst_width: NonZeroU32) -> Vec<u8> {
    let img = ImageReader::open(image)
        .unwrap()
        .with_guessed_format()
        .unwrap()
        .decode()
        .unwrap();
    let width = NonZeroU32::new(img.width()).unwrap();
    let height = NonZeroU32::new(img.height()).unwrap();
    let mut src_image = fr::Image::from_vec_u8(
        width,
        height,
        img.to_rgba8().into_raw(),
        fr::PixelType::U8x4,
    )
    .unwrap();

    // Multiple RGB channels of source image by alpha channel
    // (not required for the Nearest algorithm)
    let alpha_mul_div = fr::MulDiv::default();
    alpha_mul_div
        .multiply_alpha_inplace(&mut src_image.view_mut())
        .unwrap();

    // Keep aspect ratio
    let dst_height =
        NonZeroU32::new((dst_width.get() * height.get() / width.get()) as u32).unwrap();
    let mut dst_image = fr::Image::new(dst_width, dst_height, src_image.pixel_type());

    // Get mutable view of destination image data
    let mut dst_view = dst_image.view_mut();

    // Create Resizer instance and resize source image
    // into buffer of destination image
    let mut resizer = fr::Resizer::new(fr::ResizeAlg::Convolution(fr::FilterType::Box));
    resizer.resize(&src_image.view(), &mut dst_view).unwrap();

    // Divide RGB channels of destination image by alpha
    alpha_mul_div.divide_alpha_inplace(&mut dst_view).unwrap();

    let mut result_buf = BufWriter::new(Vec::new());
    // Create Webp encoder
    let encoder = WebPEncoder::new_lossless(&mut result_buf);
    encoder
        .encode(
            &dst_image.buffer(),
            dst_width.get(),
            dst_height.get(),
            image::ExtendedColorType::Rgba8,
        )
        .unwrap();

    return result_buf.into_inner().unwrap();
}
