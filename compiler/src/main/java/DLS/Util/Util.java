package DLS.Util;

/**
 * Created by sheng.wang on 2017/11/09.
 */
public class Util {

    public String removeDoubleQuotes(String str) {
        if (str.charAt(0) == '"' && str.charAt(str.length() - 1) == '"') {
            return str.substring(1, str.length() - 1);
        } else {
            return str;
        }
    }

}
