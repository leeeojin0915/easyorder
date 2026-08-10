import { Text, TextInput, View } from 'react-native';
import { Check, Heart, Home as HomeIcon } from 'lucide-react-native';
import { Button } from '../components/Button';

export function CompleteScreen({
  app, fs, mode, summary, total, nickname, savedThisRun,
  onChangeNickname, onSave, onGoHome,
}) {
  return (
    <View style={{ padding: 24, alignItems: 'center', minHeight: 500, justifyContent: 'center' }}>
      <View style={{
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: mode === 'practice' ? app.practiceSoft : app.realtimeSoft,
        alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        <Check size={28} color={mode === 'practice' ? app.practice : app.realtime} />
      </View>
      <Text style={{ fontSize: fs(18), fontWeight: '600', color: app.ink, marginBottom: 6 }}>
        {mode === 'practice' ? '연습을 완료했어요' : '주문을 완료했어요'}
      </Text>
      <Text style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 8, textAlign: 'center', lineHeight: fs(13) * 1.6 }}>{summary}</Text>
      <Text style={{ fontSize: fs(15), color: app.ink, fontWeight: '700', marginBottom: 20 }}>총 {total.toLocaleString()}원</Text>
      {!savedThisRun ? (
        <>
          <TextInput
            value={nickname}
            onChangeText={onChangeNickname}
            placeholder="이 조합 이름 (예: 내가 좋아하는 조합)"
            style={{
              width: '100%', height: 44, borderRadius: 10, borderWidth: 1, borderColor: app.border,
              paddingHorizontal: 12, fontSize: fs(13), marginBottom: 10, color: app.ink, backgroundColor: app.surface,
            }}
          />
          <Button app={app} variant="primary" style={{ width: '100%', marginBottom: 10 }} onPress={onSave}>
            <Heart size={16} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>내 주문으로 저장</Text>
          </Button>
        </>
      ) : (
        <Text style={{ fontSize: fs(13), color: app.practice, marginBottom: 10 }}>저장했어요</Text>
      )}
      <Button app={app} variant="ghost" style={{ width: '100%' }} onPress={onGoHome}>
        <HomeIcon size={16} color={app.inkSoft} />
        <Text style={{ color: app.inkSoft, fontSize: 15, fontWeight: '500' }}>홈으로</Text>
      </Button>
    </View>
  );
}
