import java.io.File;
import java.io.IOException;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

public class BatchOCR {
    public static void main(String[] args) {
        // 指定图片文件夹路径
        String imageFolderPath = "img";
        File folder = new File(imageFolderPath);

        // 初始化 Tesseract OCR 引擎
        Tesseract tesseract = new Tesseract();

        try {
            // 循环遍历图片文件夹
            for (File file : folder.listFiles()) {
                if (file.isFile()) {
                    // 对每个图片文件进行 OCR 识别
                    String result = tesseract.doOCR(file);
                    System.out.println(file.getName() + ":\n" + result);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (TesseractException e) {
            e.printStackTrace();
        }
    }
}
